import {authFetch} from './auth-fetch';
import {PaginateResponse, ProductCategoryTree, ProductEntity} from '../types';
import {FindAllProductCategoriesRequest, ProductCategoryEntity} from "../types";

export const productCategories = {
  findList: (request: FindAllProductCategoriesRequest): Promise<PaginateResponse<ProductCategoryEntity>> =>
    authFetch(`/api/product-categories/findList`, 'POST', request),
  findOne: (id: string): Promise<ProductCategoryEntity> =>
    authFetch(`/api/product-categories/${id}`, 'GET'),
  findAll: (): Promise<ProductCategoryEntity[]> =>
    authFetch(`/api/product-categories/findAll`, 'GET'),
  findTree: (): Promise<ProductCategoryTree[]> =>
    authFetch(`/api/product-categories/findTree`, 'GET'),
  findAllSlug: (): Promise<string[]> =>
    authFetch(`/api/product-categories/findAllSlug`, 'GET'),
};
