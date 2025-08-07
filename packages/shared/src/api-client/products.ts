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
  SimpleCreateProductRequest, FindLaunchesRequest
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
  findLaunches: (request: FindLaunchesRequest): Promise<PaginateResponse<ProductEntity>> =>
    authFetch(`/api/products/findLaunches`, 'POST', request),
  create: (request: SimpleCreateProductRequest): Promise<ProductEntity> =>
    authFetch(`/api/products`, 'POST', request),
  submit: (request: SubmitProductRequest,): Promise<RRResponse<ProductEntity | CreateOneTimePaymentResponse>> =>
    authFetch('/api/products/submit', 'POST', request),

  crawlOne: (url: string): Promise<CrawlProductResponse> =>
    authFetch(`/api/products/crawl`, 'POST', {url}),
  updateOne: (id: string, request: UpdateProductRequest): Promise<ProductEntity> =>
    authFetch(`/api/products/${id}`, 'PATCH', request),
  deleteOne: (id: string) =>
    authFetch(`/api/products/${id}`, 'DELETE', {}),

  vote: (id: string): Promise<ProductEntity> =>
    authFetch(`/api/products/${id}/vote`, 'POST'),
  unvote: (id: string): Promise<ProductEntity> =>
    authFetch(`/api/products/${id}/unvote`, 'POST'),


};
