/** Matches backend PaginatedResponseDto */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Matches backend User entity */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  provider: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: {
    id: string;
    code: string;
    name: string;
  };
  roles?: string[];
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface UserListParams {
  page: number;
  limit: number;
  condition?: string;
  [key: string]: unknown;
}
