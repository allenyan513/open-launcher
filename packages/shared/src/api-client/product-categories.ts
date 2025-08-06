import {authFetch} from './auth-fetch';
import {PaginateResponse, ProductEntity} from '../types';
import {FindAllProductCategoriesRequest, ProductCategoryEntity} from "../types";

export const productCategories = {
  findList: (request: FindAllProductCategoriesRequest): Promise<PaginateResponse<ProductCategoryEntity>> =>
    authFetch(`/api/product-categories/findList`, 'POST', request),
  findOne: (id: string): Promise<ProductCategoryEntity> =>
    authFetch(`/api/product-categories/${id}`, 'GET'),
  findAll: (): Promise<ProductCategoryEntity[]> =>
    authFetch(`/api/product-categories/findAll`, 'GET'),
  findAllSlug: (): Promise<string[]> =>
    authFetch(`/api/product-categories/findAllSlug`, 'GET'),
};
