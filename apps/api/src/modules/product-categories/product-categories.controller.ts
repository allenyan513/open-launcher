import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {JwtAuthGuard} from '@src/modules/auth/guards/jwt-auth.guards';
import {Jwt} from '@src/modules/auth/decorators/jwt.decorator';
import {JwtPayload, findAllProductCategoriesRequestSchema, UpdateProductCategoryRequest} from '@repo/shared';
import {ProductCategoriesService} from "@src/modules/product-categories/product-categories.service";


@Controller('product-categories')
export class ProductCategoriesController {
  private readonly logger = new Logger(ProductCategoriesController.name);

  constructor(private readonly productCategoriesService: ProductCategoriesService) {
  }

  @Post('findAll')
  async findAll(@Body() request: any) {
    const validatedRequest = findAllProductCategoriesRequestSchema.parse(request);
    return this.productCategoriesService.findAll(validatedRequest);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productCategoriesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateProductCategoryRequest,
  ) {
    return this.productCategoriesService.update(jwt.userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.productCategoriesService.remove(jwt.userId, id);
  }


}
