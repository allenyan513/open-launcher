import {Global, Module} from '@nestjs/common';
import {ProductCategoriesController} from './product-categories.controller';
import {ProductCategoriesService} from "./product-categories.service";

@Global()
@Module({
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  exports: [ProductCategoriesService],
})
export class ProductCategoriesModule {
}
