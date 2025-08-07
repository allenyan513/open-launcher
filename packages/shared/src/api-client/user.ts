import {authFetch} from './auth-fetch';
import {UserEntity} from '../types';
import {AuthFetchOptions} from "./index";

export const user = {
  getUserProfile: (options?: AuthFetchOptions): Promise<UserEntity> =>
    authFetch('/api/users/profile', 'GET', {}, options),
  findCurrent: (): Promise<UserEntity> => authFetch(`/api/users/current`, 'GET', {}),
  findOneBySlug: (slug: string): Promise<UserEntity | null> =>
    authFetch(`/api/users/slug/${slug}`, 'GET', {}),
  deleteAccount: (): Promise<void> => authFetch(`/api/users/delete`, 'DELETE', {}),
};
