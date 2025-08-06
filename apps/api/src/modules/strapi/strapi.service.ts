import {Injectable, Logger} from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class StrapiService {
  private logger = new Logger(StrapiService.name);
  private baseUrl = '';
  private headers = {};

  constructor(private prismaService: PrismaService) {
    this.baseUrl = process.env.STRAPI_API_URL as string;
    const token = process.env.STRAPI_API_FULL_ACCESS_TOKEN as string;
    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async create(resource: string, data: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/${resource}`,
        data,
        {
          headers: this.headers,
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error creating resource: ${error}`);
    }
  }

  /**
   * read 返回单个
   * @param resource
   * @param id
   * @param query
   */
  async read(resource: string, id: string, query?: any): Promise<any> {
    try {
      const queryString = qs.stringify(query, {
        encodeValuesOnly: true,
      });
      const url = `${this.baseUrl}/api/${resource}/${id}?${queryString}`;
      const response = await axios.get(url, {headers: this.headers});
      return response.data;
    } catch (error) {
      this.logger.error(`Error reading resource: ${error}`);
    }
  }

  /**
   * find 返回多个
   * @param resource
   * @param query
   */
  async find(resource: string, query: any): Promise<any> {
    try {
      const queryString = qs.stringify(query, {
        encodeValuesOnly: true,
      });
      const url = `${this.baseUrl}/api/${resource}?${queryString}`;
      const response = await axios.get(url, {headers: this.headers});
      return response.data;
    } catch (error) {
      this.logger.error(`Error finding resources: ${error}`);
    }
  }

  async update(
    resource: string,
    id: string,
    data: any,
    locale?: string,
  ): Promise<any> {
    try {
      const url = locale
        ? `${this.baseUrl}/api/${resource}/${id}?locale=${locale}`
        : `${this.baseUrl}/api/${resource}/${id}`;
      const response = await axios.put(
        url,
        {
          data: data,
        },
        {
          headers: this.headers,
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error updating resource: ${error}`);
    }
  }

  async delete(resource: string, id: string): Promise<any> {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/api/${resource}/${id}`,
        {
          headers: this.headers,
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error deleting resource: ${error}`);
    }
  }

  // async upload(inputPath: string) {
  //   try {
  //     const form = new FormData();
  //     form.append('files', fs.createReadStream(inputPath));
  //     const response = await axios.post(`${this.baseUrl}/api/upload`, form, {
  //       headers: {
  //         ...this.headers,
  //         ...form.getHeaders(),
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     this.logger.error('Upload failed:');
  //     throw error;
  //   }
  // }

  async transformProductContent() {
    const languages = ['en', 'zh', 'ja', 'ko', 'vi', 'fr', 'de', 'es', 'pt'];
    let page = 1;
    let pageSize = 20;
    while (true) {
      const products = await this.prismaService.product.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      if (products.length === 0) {
        break;
      }
      for (const item of products) {
        try {
          for (const lang of languages) {
            // 通过slug 查询其他语言的内容
            const otherLanguages = await this.find('products', {
              filters: {
                slug: {
                  $eq: item.slug,
                },
              },
              locale: lang,
            })
            if (otherLanguages.data.length > 0) {
              const otherLanguage = otherLanguages.data[0];
              await this.prismaService.productContent.create({
                data: {
                  productId: item.id,
                  language: lang,
                  tagline: otherLanguage.description,
                  description: otherLanguage.description,
                  longDescription: otherLanguage.longDescription || '',
                  features: otherLanguage.features || '',
                  useCase: otherLanguage.useCases || '',
                  howToUse: otherLanguage.howToUse || '',
                }
              });
            }
          }
        } catch (error) {
          this.logger.error(`Error creating product: ${error}`);
        }
      }
      page++;
    }
  }


  async transformProducts() {
    const languages = ['zh', 'ja', 'ko', 'vi', 'fr', 'de', 'es', 'pt'];
    let page = 1;
    let pageSize = 20;
    while (true) {
      const result = await this.find('products', {
        pagination: {
          page: page,
          pageSize: pageSize,
        },
        filters: {
          name: {
            $ne: null,
          },
          slug: {
            $ne: null,
          },
        },
        populate: ['logo', 'screenShot', 'productCategories'],
        locale: 'en',
      });
      if (result.data.length === 0) {
        break;
      }
      for (const item of result.data) {
        const slugs = item.productCategories.map((category) => {
          return category.slug;
        });
        const productCategories =
          await this.prismaService.productCategory.findMany({
            where: {
              slug: {
                in: slugs,
              },
            },
            select: {
              id: true,
            },
          });
        const ids = productCategories.map((category) => {
          return category.id;
        });
        const mapIds = ids.map((id) => {
          return {id: id};
        })
        try {
          const newProduct = await this.prismaService.product.create({
            data: {
              userId: '70cb76fe-15b2-4dff-a64b-65e2a9722047',
              name: item.name,
              slug: item.slug,
              url: item.url,
              status: 'approved',
              icon: item.logo?.url || '',
              screenshots: [item.screenShot?.url || ''],
              featured: false,
              productCategories: {
                connect: mapIds
              },
              tagline: item.description || '',
              description: item.description || '',
              longDescription: item.longDescription || '',
              features: item.features || '',
              useCase: item.useCases || '',
              howToUse: item.howToUse || '',
            },
          });

          for (const lang of languages) {
            // 通过slug 查询其他语言的内容
            const otherLanguages = await this.find('products', {
              filters: {
                slug: {
                  $eq: item.slug,
                },
              },
              locale: lang,
            })
            if (otherLanguages.data.length > 0) {
              const otherLanguage = otherLanguages.data[0];
              await this.prismaService.productContent.create({
                data: {
                  productId: newProduct.id,
                  language: lang,
                  tagline: otherLanguage.description,
                  description: otherLanguage.description,
                  longDescription: otherLanguage.longDescription || '',
                  features: otherLanguage.features || '',
                  useCase: otherLanguage.useCases || '',
                  howToUse: otherLanguage.howToUse || '',
                }
              });
            }
          }
        } catch (error) {
          this.logger.error(`Error creating product: ${error}`);
        }
      }
      page++;
    }
  }

  async transformProductCategories() {
    let page = 1;
    let pageSize = 20;
    while (true) {
      const result = await this.find('product-categories', {
        pagination: {
          page: page,
          pageSize: pageSize,
        },
        filters: {
          name: {
            $ne: null,
          },
          slug: {
            $ne: null,
          },
          group: {
            $ne: null,
          },
        },
      });
      if (result.data.length === 0) {
        break;
      }
      console.log('result.data.length', result.data.length);
      console.log('page', page);
      for (const item of result.data) {
        const response = await this.prismaService.productCategory.create({
          data: {
            name: item.name,
            slug: item.slug,
            group: item.group,
            whoToUse: item.whoToUse,
            howItWork: item.howItWork,
            advantages: item.advantages,
            description: item.description,
            faqs: item.faqs,
            features: item.featuresmd,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
      page++;
    }
  }
}
