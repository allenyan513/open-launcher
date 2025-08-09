import {auth} from './auth';
import {s3} from './s3';
import {user} from './user';
import {order} from './order';
import {products} from './products';
import {productCategories} from "./product-categories";

export const api = {
  auth: auth,
  s3: s3,
  user: user,
  order: order,
  products: products,
  productCategories: productCategories,
};

export interface AuthFetchOptions {
  headers?: HeadersInit;
  timeout?: number;
}


export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class BadRequestError extends Error {
  constructor(message: string = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends Error {
  constructor(message: string = 'Server Error') {
    super(message);
    this.name = 'ServerError';
  }
}

