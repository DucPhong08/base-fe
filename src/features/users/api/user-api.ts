import { httpClient } from '../../../shared/api/http-client';
import type {
  CreateUserPayload,
  PaginatedResponse,
  UpdateUserPayload,
  User,
  UserListParams,
} from '../types';

const BASE = '/users';

export const userApi = {
  getPage(params: UserListParams): Promise<PaginatedResponse<User>> {
    return httpClient.get(`${BASE}/page`, { params }) as Promise<
      PaginatedResponse<User>
    >;
  },

  getById(id: string): Promise<User> {
    return httpClient.get(`${BASE}/${id}`) as Promise<User>;
  },

  create(data: CreateUserPayload): Promise<User> {
    return httpClient.post(BASE, data) as Promise<User>;
  },

  update(id: string, data: UpdateUserPayload): Promise<User> {
    return httpClient.put(`${BASE}/${id}`, data) as Promise<User>;
  },

  delete(id: string): Promise<void> {
    return httpClient.delete(`${BASE}/${id}`) as Promise<void>;
  },
};
