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
