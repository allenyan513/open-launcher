import {authFetch} from './auth-fetch';
import {PaginateResponse, ProductEntity} from '../types';
import {FindAllProductCategoriesRequest, ProductCategoryEntity} from "../types";

export const productCategories = {
  findAll: (request: FindAllProductCategoriesRequest): Promise<PaginateResponse<ProductCategoryEntity>> =>
    authFetch(`/api/product-categories/findAll`, 'POST', request),
  findOne: (id: string): Promise<ProductCategoryEntity> =>
    authFetch(`/api/product-categories/${id}`, 'GET'),
  findAllSlug: (): Promise<string[]> =>
    authFetch(`/api/product-categories/findAllSlug`, 'GET'),
};
