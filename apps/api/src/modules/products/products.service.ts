import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {
  CrawlProductResponse,
  CreateProductRequest,
  FindAllRequest,
  ProductEntity,
  SubmitProductRequest,
  UpdateProductRequest,
  PaginateResponse,
  RRResponse,
  CreateOneTimePaymentResponse,
  hash,
  SimpleCreateProductRequest,
} from '@repo/shared';
import slugify from 'slugify';
import {$Enums} from '@repo/database/generated/client';
import ProductStatus = $Enums.ProductStatus;
import {OrdersService} from '../orders/orders.service';
import {BrowserlessService} from '@src/modules/browserless/browserless.service';
import {S3Service} from '@src/modules/s3/s3.service';
import * as fs from 'fs';
import * as mime from 'mime-types';
import ReactDOMServer from 'react-dom/server';
import {BadgeSvg} from './badge.svg';
import * as React from 'react';
import * as cheerio from 'cheerio';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService');

  constructor(
    private prismaService: PrismaService,
    private orderService: OrdersService,
    private browserlessService: BrowserlessService,
    private s3Service: S3Service,
  ) {
  }

  /**
   * @param uid
   * @param dto
   */
  // async create(uid: string, dto: CreateProductRequest) {
  async create(uid: string, dto: SimpleCreateProductRequest) {
    const slug = slugify(dto.name, {
      lower: true,
      strict: true,
    });
    //check if the product with the same slug already exists
    const existingProduct = await this.prismaService.product.findFirst({
      where: {
        slug: slug,
      },
    });
    if (existingProduct) {
      this.logger.error(
        `Product with slug ${slug} already exists for user ${uid}`,
      );
      throw new BadRequestException(`Product with slug ${slug} already exists`);
    }
    const crawlProductResponse = await this.crawlProductInfo(dto.url);
    if (!crawlProductResponse) {
      this.logger.error(`Failed to crawl product info for URL: ${dto.url}`);
      throw new BadRequestException(`Failed to crawl product info for URL: ${dto.url}`);
    }
    return this.prismaService.product.create({
      data: {
        userId: uid,
        url: dto.url,
        name: dto.name,
        slug: slug,
        tagline: crawlProductResponse.title || '',
        description: crawlProductResponse.description || '',
        icon: crawlProductResponse.faviconUrl || '',
        screenshots: [crawlProductResponse.screenshotUrl] || [],
        group: '',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async crawlProductInfo(url: string) {
    this.logger.debug(`Crawling product info with URL: ${url}`,
    );
    const validatedUrl = new URL(url);
    const {title, description, content, faviconFilePath, screenshotFilePath} =
      await this.browserlessService.extract(validatedUrl.href, {
        contentEnable: false,
        faviconEnable: true,
        screenshotEnable: true,
      });
    this.logger.debug(`Extracted Result:`, {
      title,
      description,
      faviconFilePath,
      screenshotFilePath,
    });

    let faviconUrl = '';
    if (fs.existsSync(faviconFilePath)) {
      const faviconKey = `${hash(Date.now().toString())}${mime.lookup(faviconFilePath)}`;
      await this.s3Service.uploadFile(
        faviconKey,
        fs.readFileSync(faviconFilePath),
        mime.lookup(faviconFilePath) || 'image/png',
      );
      faviconUrl = this.s3Service.getUrl(faviconKey);
    }

    let screenshotUrl = '';
    if (fs.existsSync(screenshotFilePath)) {
      const screenshotKey = `${hash(Date.now().toString())}${mime.lookup(screenshotFilePath)}`;
      await this.s3Service.uploadFile(
        screenshotKey,
        fs.readFileSync(screenshotFilePath),
        mime.lookup(screenshotFilePath) || 'image/png',
      );
      screenshotUrl = this.s3Service.getUrl(screenshotKey);
    }
    return {
      title: title,
      description: description,
      faviconUrl: faviconUrl,
      screenshotUrl: screenshotUrl,
    } as CrawlProductResponse;
  }

  /**
   * 申请创建一个产品
   * 分成多种提交方式：1）免费提交 2）付费提交
   * 付费提交需要检查用户是否有足够的余额，没有的话就返回支付链接,如果有余额的话就直接创建产品
   * @param uid
   * @param dto
   */
  async submit(
    uid: string,
    dto: SubmitProductRequest,
  ): Promise<RRResponse<ProductEntity | CreateOneTimePaymentResponse>> {
    if (dto.submitOption === 'paid-submit') {
      return this.createPaidSubmit(uid, dto);
    } else if (dto.submitOption === 'free-submit') {
      return this.createFreeSubmit(uid, dto);
    } else {
      this.logger.error(`Unknown submit option: ${dto.submitOption}`);
      return {
        code: 400,
        message: 'Unknown submit option',
        data: null,
      };
    }
  }

  /**
   * 创建一个付费提交的产品
   * @param uid
   * @param dto
   */
  async createPaidSubmit(
    uid: string,
    dto: SubmitProductRequest,
  ): Promise<RRResponse<ProductEntity | CreateOneTimePaymentResponse>> {
    // Check if the user has enough balance for paid submission
    const user = await this.prismaService.user.findUnique({
      where: {id: uid},
      select: {balance: true},
    });
    if (!user) {
      throw new Error(`User with ID ${uid} not found`);
    }
    const stripeProductId = process.env.STRIPE_PAID_SUBMIT_PRODUCT_ID;
    const stripeProductPriceDecimal =
      await this.orderService.getProductPriceDecimal(stripeProductId);
    if (user.balance.lt(stripeProductPriceDecimal)) {
      this.logger.debug(
        `User ${uid} does not have enough balance for paid submission`,
      );
      const session = await this.orderService.createOneTimePayment(uid, {
        productId: stripeProductId,
      });
      return {
        code: 600,
        message: 'Insufficient balance for paid submission',
        data: session as CreateOneTimePaymentResponse,
      };
    } else {
      this.logger.debug(`User ${uid} has enough balance for paid submission`);
      // Deduct the balance from the user
      await this.prismaService.user.update({
        where: {id: uid},
        data: {
          balance: {
            decrement: stripeProductPriceDecimal,
          },
        },
      });
      const product = await this.prismaService.product.update({
        where: {
          id: dto.id,
        },
        data: {
          status: 'approved',
          featured: true,
          updatedAt: new Date(),
        },
      });
      return {
        code: 200,
        message: 'Product created successfully',
        data: product as ProductEntity,
      };
    }
  }

  /**
   * 创建一个免费提交的产品
   * @param uid
   * @param dto
   */
  async createFreeSubmit(
    uid: string,
    dto: SubmitProductRequest,
  ): Promise<RRResponse<ProductEntity>> {
    const existingProduct = await this.prismaService.product.findUnique({
      where: {
        id: dto.id,
      },
    });
    if (!existingProduct) {
      this.logger.error(`Product with ID ${dto.id} not found for user ${uid}`);
      return {
        code: 404,
        message: `Product with ID ${dto.id} not found`,
        data: null,
      };
    }
    const targets = [process.env.NEXT_PUBLIC_APP_URL];
    const verifyResult = await this.verifyEmbedCode(
      targets,
      existingProduct.url,
    );
    if (verifyResult.code !== 200 || !verifyResult.data) {
      this.logger.error(
        `Widget embedding verification failed for user ${uid} with URL: ${existingProduct.url}`,
      );
      return {
        code: 400,
        message: 'Widget embedding verification failed',
        data: null,
      };
    }
    const product = await this.prismaService.product.update({
      where: {
        id: dto.id,
      },
      data: {
        status: 'approved',
        updatedAt: new Date(),
      },
    });
    return {
      code: 200,
      message: 'Product created successfully',
      data: product,
    };
  }

  async findAll(
    uid: string,
    request: FindAllRequest,
  ): Promise<PaginateResponse<ProductEntity>> {
    // this.logger.debug('request to findAll products', request);
    const {status, group, search, tags, orderBy, productCategorySlug} = request;
    // if exists productCategorySlug, find productCategoryId
    let productCategoryId = request.productCategoryId;
    if (productCategorySlug) {
      const productCategory = await this.prismaService.productCategory.findFirst({
        where: {
          slug: productCategorySlug,
        },
        select: {
          id: true,
        },
      });
      if (productCategory) {
        productCategoryId = productCategory.id;
      } else {
        throw new BadRequestException(`Product category with slug ${productCategorySlug} not found`);
      }
    }

    const whereCondition: any = {
      ...(uid && {
        userId: uid, // Filter by user ID if provided
      }),
      ...(status && {
        status: {
          in: status as ProductStatus[], // Filter by status if provided
        },
      }),
      ...(group && {
        group: group
      }),
      ...(search && {
        OR: [
          {name: {contains: search, mode: 'insensitive'}},
          {description: {contains: search, mode: 'insensitive'}},
        ],
      }),
      ...(tags && tags.length > 0 && {
        tags: {
          hasSome: tags, // Filter by tags if provided
        },
      }),
      ...(productCategoryId && {
        productCategories: {
          some: {
            id: productCategoryId, // Filter by product category ID if provided
          },
        },
      })
    };
    const total = await this.prismaService.product.count({
      where: {
        ...whereCondition,
      },
    });
    const items = await this.prismaService.product.findMany({
      where: {
        ...whereCondition,
      },
      orderBy: {
        [orderBy?.field || 'createdAt']: orderBy?.direction || 'desc',
      },
      take: request.pageSize || 10,
      skip: (request.page - 1) * (request.pageSize || 10),
      include: {
        productCategories: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    });

    return {
      items: items,
      meta: {
        page: request.page,
        pageSize: request.pageSize || 10,
        total: total,
        pageCount: Math.ceil(total / (request.pageSize || 10)),
      },
    };
  }

  async findAllSlug(): Promise<string[]> {
    const products = await this.prismaService.product.findMany({
      where: {
        slug: {
          not: null,
        },
      },
      select: {
        slug: true,
      },
    });
    return products.map(product => product.slug);
  }

    /**
   *
   * @param id or slug
   */
  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.prismaService.product.findFirst({
      where: {
        OR: [{id: id}, {slug: id}],
      },
      include: {
        productCategories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    if (!product) {
      throw new BadRequestException(`Product with ID ${id} not found`);
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: product.userId,
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
      },
    });
    return {
      ...product,
      user: user,
    } as ProductEntity;
  }

  async update(uid: string, id: string, dto: UpdateProductRequest) {
    return this.prismaService.product.update({
      where: {
        id: id,
      },
      data: {
        icon: dto.icon,
        screenshots: dto.screenshots || [],
        description: dto.description,
        tagline: dto.tagline,
        updatedAt: new Date(), // Update the timestamp
      },
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.product.delete({
      where: {
        id: id,
      },
    });
  }

  async generateProductBadgeSvg(id: string, theme: 'light' | 'dark') {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error('Product not found');
    }
    const el = React.createElement(BadgeSvg, {
      averageRating: 5,
      totalReviews: 5,
      theme: theme,
    });
    const svgString = ReactDOMServer.renderToStaticMarkup(el);
    return `<?xml version="1.0" encoding="UTF-8"?>\n${svgString}`;
  }

  /**
   * @param targets
   * @param url
   */
  async verifyEmbedCode(
    targets: string[],
    url: string,
  ): Promise<RRResponse<boolean>> {
    const {content} = await this.browserlessService.extract(url, {
      contentEnable: true,
      faviconEnable: false,
      screenshotEnable: false,
    });
    if (!content) {
      this.logger.error(`No content found for URL: ${url}`);
      return {
        code: 400,
        message: 'No content found for the provided URL',
        data: false,
      };
    }
    const $ = cheerio.load(content);
    let linkExists = false;
    for (const target of targets) {
      const linkSelector = `a[href*="${target}"]`;
      if ($(linkSelector).length > 0) {
        linkExists = true;
        break; // 如果找到一个匹配的链接，就可以停止检查
      }
    }
    return {
      code: linkExists ? 200 : 400,
      message: linkExists
        ? 'Widget embedding verified successfully!'
        : 'Widget embedding verification failed',
      data: linkExists,
    } as RRResponse<boolean>;
  }
}
