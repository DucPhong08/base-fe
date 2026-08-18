import { createBaseCrudApi } from '../../../shared/api/base-crud-api';
import type { CreateUserPayload, UpdateUserPayload, User } from '../types';

/**
 * Base CRUD API client cho Module Users.
 * Tự động thừa hưởng: getPage, getMany, getById, create, update, delete, deleteMany.
 */
export const userApi = createBaseCrudApi<
  User,
  CreateUserPayload,
  UpdateUserPayload
>('/users');
