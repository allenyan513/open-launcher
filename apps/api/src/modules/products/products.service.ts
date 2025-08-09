import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {
  CrawlProductResponse,
  FindAllRequest,
  ProductEntity,
  SubmitProductRequest,
  UpdateProductRequest,
  PaginateResponse,
  RRResponse,
  CreateOneTimePaymentResponse,
  hash,
  SimpleCreateProductRequest, FindLaunchesRequest, submitProductSchema,
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
import {ProductCategoriesService} from "@src/modules/product-categories/product-categories.service";
import {NotificationsService} from "@src/modules/notifications/notifications.service";
import {Cron} from "@nestjs/schedule";

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService');

  constructor(
    private prismaService: PrismaService,
    private orderService: OrdersService,
    private browserlessService: BrowserlessService,
    private s3Service: S3Service,
    private productCategoriesService: ProductCategoriesService,
    private notificationsService: NotificationsService,
  ) {
  }

  /**
   * @param uid
   * @param dto
   */
  async create(uid: string, dto: SimpleCreateProductRequest): Promise<RRResponse<ProductEntity>> {
    const {url, name} = dto;
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });
    //check if the product with the same slug or url already exists
    const existingProduct = await this.prismaService.product.findFirst({
      where: {
        OR: [
          {slug: slug},
          {url: url},
        ],
      },
      select: {
        id: true,
        slug: true,
        url: true,
        name: true,
        userId: true,
      }
    });
    if (existingProduct) {
      return {
        code: existingProduct.userId === uid ? 400 : 403,
        message: `Product with slug ${slug} or URL ${url} already exists`,
        data: existingProduct,
      } as RRResponse<ProductEntity>;
    }
    const crawlProductResponse = await this.crawlProductInfo(url);
    if (!crawlProductResponse) {
      return {
        code: 400,
        message: 'Failed to crawl product info',
        data: null,
      } as RRResponse<ProductEntity>;
    }
    const newProduct = await this.prismaService.product.create({
      data: {
        userId: uid,
        url: url,
        name: name,
        slug: slug,
        tagline: crawlProductResponse.title || '',
        description: crawlProductResponse.description || '',
        icon: crawlProductResponse.faviconUrl || '',
        screenshots: [crawlProductResponse.screenshotUrl] || [],
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return {
      code: 200,
      message: 'Product created successfully',
      data: newProduct as ProductEntity,
    } as RRResponse<ProductEntity>
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
    this.logger.debug(`User ${uid} is submitting a product with data:`, dto);
    if (dto.submitOption === 'standard-launch') {
      return this.createStandardLaunch(uid, dto);
    } else if (dto.submitOption === 'verified-launch') {
      return this.createVerifiedLaunch(uid, dto);
    } else if (dto.submitOption === 'premium-launch') {
      return this.createPremiumLaunch(uid, dto);
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
  async createPremiumLaunch(
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
          launchDate: dto.launchDate || new Date(),
          featured: true,
          updatedAt: new Date(),
        },
      });
      await this.notificationsService.onProductStatusChanged(product.id)
      return {
        code: 200,
        message: 'Product created successfully',
        data: product as ProductEntity,
      };
    }
  }

  /**
   * 创建一个标准提交的产品
   * @param uid
   * @param dto
   */
  async createStandardLaunch(
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
    //检查launchDate是否在未来，且大于7天以上
    const now = new Date();
    const minAllowedDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 当前时间 + 7 天
    if (dto.launchDate < minAllowedDate) {
      this.logger.error(
        `Launch date ${dto.launchDate} must be at least 7 days in the future for user ${uid}`,
      );
      return {
        code: 400,
        message: 'Launch date must be at least 7 days in the future',
        data: null,
      };
    }
    const product = await this.prismaService.product.update({
      where: {
        id: dto.id,
      },
      data: {
        status: 'scheduled',
        launchDate: dto.launchDate || new Date(),
        updatedAt: new Date(),
      },
    });
    await this.notificationsService.onProductStatusChanged(product.id)
    return {
      code: 200,
      message: 'Product created successfully',
      data: product,
    };
  }

  async createVerifiedLaunch(
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
    //检查launchDate是否在未来
    const now = new Date();
    if (dto.launchDate < now) {
      this.logger.error(
        `Launch date ${dto.launchDate} must be in the future for user ${uid}`,
      );
      return {
        code: 400,
        message: 'Launch date must be in the future',
        data: null,
      };
    }

    const targets = [process.env.NEXT_PUBLIC_ENDPOINT_URL as string];
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
        launchDate: dto.launchDate || new Date(),
        updatedAt: new Date(),
      },
    });
    await this.notificationsService.onProductStatusChanged(product.id)
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
    const {status, search, orderBy, productCategorySlug} = request;
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
        return {
          items: [],
          meta: {
            page: request.page,
            pageSize: request.pageSize || 10,
            total: 0,
            pageCount: 0,
          }
        }
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
      ...(search && {
        OR: [
          {name: {contains: search, mode: 'insensitive'}},
          {description: {contains: search, mode: 'insensitive'}},
        ],
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
      orderBy: orderBy?.map((item) => ({
        [item.field]: item.direction,
      })) || [{createdAt: 'desc'}],
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
  async findOne(id: string): Promise<ProductEntity | null> {
    return this.prismaService.product.findFirst({
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
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        productContents: true,
      },
    });
  }

  async update(uid: string, id: string, dto: UpdateProductRequest) {
    const data: any = {
      updatedAt: new Date(),
    };
    if (dto.icon) {
      data.icon = dto.icon;
    }
    if (dto.screenshots) {
      data.screenshots = dto.screenshots;
    }
    if (dto.tagline) {
      data.tagline = dto.tagline;
    }
    if (dto.description) {
      data.description = dto.description;
    }
    if (dto.productCategoryIds) {
      data.productCategories = {
        set: dto.productCategoryIds?.map((categoryId) => ({
          id: categoryId,
        }))
      };
    }
    if (dto.longDescription) {
      data.longDescription = dto.longDescription;
    }
    if (dto.features) {
      data.features = dto.features;
    }
    if (dto.useCase) {
      data.useCase = dto.useCase;
    }
    if (dto.howToUse) {
      data.howToUse = dto.howToUse;
    }
    if (dto.faq) {
      data.faq = dto.faq;
    }
    if (dto.socialLinks) {
      data.socialLinks = dto.socialLinks;
    }
    return this.prismaService.product.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.product.delete({
      where: {
        id: id,
        userId: uid,
      },
    });
  }

  async generateProductBadgeSvg(id: string, text: string, theme: 'light' | 'dark') {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error('Product not found');
    }
    const el = React.createElement(BadgeSvg, {
      text: text,
      voteCount: product.voteCount || 0,
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
        ? 'Verified successfully!'
        : 'Verification failed',
      data: linkExists,
    } as RRResponse<boolean>;
  }

  async vote(userId: string, id: string) {
    //check if the user has already voted for this product
    const existingVote = await this.prismaService.productVote.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: id,
        },
      },
    })
    if (existingVote) {
      this.logger.warn(`User ${userId} has already voted for product ${id}`);
      throw new BadRequestException('You have already voted for this product');
    }
    // Create a new vote record
    await this.prismaService.productVote.create({
      data: {
        userId: userId,
        productId: id,
      },
    })
    // Increment the vote count for the product
    return this.prismaService.product.update({
      where: {
        id: id,
      },
      data: {
        voteCount: {
          increment: 1, // Increment the vote count
        },
        updatedAt: new Date(), // Update the timestamp
      },
    })
  }

  async unvote(userId: string, id: string) {
    // Check if the user has voted for this product
    const existingVote = await this.prismaService.productVote.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: id,
        },
      },
    });
    if (!existingVote) {
      this.logger.warn(`User ${userId} has not voted for product ${id}`);
      throw new BadRequestException('You have not voted for this product');
    }
    // Delete the vote record
    await this.prismaService.productVote.delete({
      where: {
        userId_productId: {
          userId: userId,
          productId: id,
        },
      },
    });
    // Decrement the vote count for the product
    return this.prismaService.product.update({
      where: {
        id: id,
      },
      data: {
        voteCount: {
          decrement: 1, // Decrement the vote count
        },
        updatedAt: new Date(), // Update the timestamp
      },
    });
  }

  async findLaunches(uid: string, request: FindLaunchesRequest): Promise<PaginateResponse<ProductEntity>> {
    const {page, pageSize, launchesType} = request;
    // launchesType can be 'today', 'week', or 'month'
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0)); // 今天 00:00:00
    const endOfYesterday = new Date(todayStart.getTime() - 1); // 昨天 23:59:59.999
    const startOf7DaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 天前 00:00:00
    const startOf30DaysAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 天前 00:00:00

    const whereCondition: any = {
      status: 'approved',
      ...(launchesType === 'today' && {
        launchDate: {
          gte: todayStart,
          lte: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1), // 今天结束
        },
      }),
      ...(launchesType === 'week' && {
        launchDate: {
          gte: startOf7DaysAgo,
          lte: endOfYesterday,
        },
      }),
      ...(launchesType === 'month' && {
        launchDate: {
          gte: startOf30DaysAgo,
          lte: endOfYesterday,
        },
      }),
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
      orderBy: [
        {voteCount: 'desc'},
        {launchDate: 'desc'},
      ],
      take: pageSize || 10,
      skip: (page - 1) * (pageSize || 10),
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        tagline: true,
        description: true,
        voteCount: true,
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
        page: page,
        pageSize: pageSize || 10,
        total: total,
        pageCount: Math.ceil(total / (pageSize || 10)),
      },
    };
  }

  /**
   * 一次性渲染所有产品, 主要用于生成静态页面
   * 1. 根据PRODUCT_CATEGORY 循环查询每个分类下的前100个产品
   *
   */
  async findProducts(): Promise<Record<string, ProductEntity[]>> {
    this.logger.debug('Fetching all products by category');
    const results: Record<string, ProductEntity[]> = {};
    const tree = await this.productCategoriesService.findTree();
    for (const category of tree) {
      const ids = await this.prismaService.productCategory.findMany({
        where: {
          group: category.name,
        },
        select: {
          id: true,
        },
      })
      const products = await this.prismaService.product.findMany({
        where: {
          productCategories: {
            some: {
              id: {
                in: ids.map(item => item.id),
              }
            }
          }
        },
        orderBy: {
          voteCount: 'desc',
        },
        select: {
          id: true,
          name: true,
          slug: true,
          url: true,
          tagline: true,
          voteCount: true,
        },
        take: 100,
      })
      results[category.name] = products;
    }
    return results;
  }


  /**
   * 定时任务：
   * 1. 每天9:00AM执行
   * 2. 查询所有scheduled产品, 如果launchDate小于等于今天的日期，则将状态改为approved
   */
  @Cron('0 9 * * *') // 每天9:00AM执行
  async scheduleProductLaunches(): Promise<void> {
    this.logger.debug('Scheduling product launches');
    const now = new Date();
    const todayStart = new Date(now.setHours(9, 0, 0, 0)); // 今天 9:00:00
    const productsToLaunch = await this.prismaService.product.findMany({
      where: {
        status: 'scheduled',
        launchDate: {
          lte: todayStart,
        },
      },
    });
    if (productsToLaunch.length === 0) {
      this.logger.debug('No products to launch today');
      return;
    }
    for (const product of productsToLaunch) {
      await this.prismaService.product.update({
        where: {
          id: product.id,
        },
        data: {
          status: 'approved',
          updatedAt: new Date(),
        },
      });
      await this.notificationsService.onProductStatusChanged(product.id);
    }
    this.logger.debug(`Launched ${productsToLaunch.length} products successfully`);
  }
}
