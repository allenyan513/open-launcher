import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {
  PaginateResponse, FindAllProductCategoriesRequest, ProductCategoryEntity, UpdateProductCategoryRequest,
} from '@repo/shared';

@Injectable()
export class ProductCategoriesService {
  private logger = new Logger('ProductCategoriesService');

  constructor(private prismaService: PrismaService,) {
  }

  async findAll(
    request: FindAllProductCategoriesRequest,
  ): Promise<PaginateResponse<ProductCategoryEntity>> {
    const {group} = request
    const whereCondition: any = {
      ...(group && {
        group: group
      }),
    };
    const total = await this.prismaService.productCategory.count({
      where: {
        ...whereCondition,
      },
    });
    const items = await this.prismaService.productCategory.findMany({
      where: {
        ...whereCondition,
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date
      },
      take: request.pageSize || 10,
      skip: (request.page - 1) * (request.pageSize || 10),
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
    const products = await this.prismaService.productCategory.findMany({
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
  async findOne(id: string): Promise<ProductCategoryEntity> {
    return this.prismaService.productCategory.findFirst({
      where: {
        OR: [{id: id}, {slug: id}],
      },
    });
  }

  async update(uid: string, id: string, dto: UpdateProductCategoryRequest) {
    return this.prismaService.productCategory.update({
      where: {
        id: id,
      },
      data: {
        updatedAt: new Date(), // Update the timestamp
      },
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.productCategory.delete({
      where: {
        id: id,
      },
    });
  }


}
