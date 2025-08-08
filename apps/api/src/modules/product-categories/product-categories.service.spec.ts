import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeEach } from '@jest/globals';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import {ProductCategoriesService} from "./product-categories.service";

describe('ProductCategoriesService', () => {
  let service: ProductCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        PrismaModule, // Assuming PrismaModule is defined in your application
      ],
      providers: [ProductCategoriesService],
    }).compile();

    service = module.get<ProductCategoriesService>(ProductCategoriesService);
  });

  // it('import product hunt categories', async () => {
  //   const result = await service.importProductHuntCategory()
  //   console.log(result)
  // },100000);

});
