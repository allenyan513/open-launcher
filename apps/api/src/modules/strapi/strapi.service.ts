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
  async transformProducts() {
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
      // console.log('result.data.length', result.data.length);
      console.log('page', page);
      // console.log(result);
      // console.log(result.data[0].screenShot);
      // console.log(result.data[0].productCategories);

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
          const response = await this.prismaService.product.create({
            data: {
              userId: 'af55d296-af60-4fdd-ac69-df94b7be94b2',
              name: item.name,
              slug: item.slug,
              url: item.url,
              status: 'approved',
              icon: item.logo?.url || '',
              screenshots: [item.screenShot?.url || ''],
              tagline: item.description || '',
              featured: false,
              group: item.group || '',
              productCategories: {
                connect: mapIds
              },
              longDescription: item.longDescription || '',
              features: item.features || '',
              useCase: item.useCases || '',
              howToUse: item.howToUse || '',
            },
          });
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
