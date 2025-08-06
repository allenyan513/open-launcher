import {authFetch} from './auth-fetch';
import {
  FindAllRequest,
  ProductEntity,
  UserEntity,
  PaginateResponse,
  CrawlProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  RRResponse,
  CreateOneTimePaymentResponse,
  SubmitProductRequest,
  SimpleCreateProductRequest
} from '../types';

export const products = {
  findAll: (request: FindAllRequest): Promise<PaginateResponse<ProductEntity>> =>
    authFetch(`/api/products/findAll`, 'POST', request),
  findMyAll: (request: FindAllRequest): Promise<PaginateResponse<ProductEntity>> =>
    authFetch(`/api/products/my/findAll`, 'POST', request),
  findOne: (id: string): Promise<ProductEntity | null> =>
    authFetch(`/api/products/${id}`, 'GET'),
  findAllSlug: (): Promise<string[]> =>
    authFetch(`/api/products/findAllSlug`, 'GET'),
  create: (request: SimpleCreateProductRequest): Promise<ProductEntity> =>
    authFetch(`/api/products`, 'POST', request),
  submit: (request: SubmitProductRequest,): Promise<RRResponse<ProductEntity | CreateOneTimePaymentResponse>> =>
    authFetch('/api/products/submit', 'POST', request),

  crawlOne: (url: string): Promise<CrawlProductResponse> =>
    authFetch(`/api/products/crawl`, 'POST', {url}),
  updateOne: (id: string, data: ProductEntity): Promise<ProductEntity> =>
    authFetch(`/api/products/${id}`, 'PATCH', data),
  deleteOne: (id: string) =>
    authFetch(`/api/products/${id}`, 'DELETE', {}),

};
