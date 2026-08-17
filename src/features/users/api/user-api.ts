import { httpClient } from '../../../shared/api/http-client';
import type {
  CreateUserPayload,
  PaginatedResponse,
  UpdateUserPayload,
  User,
  UserListParams,
} from '../types';

import { MOCK_USERS_DATA } from '../mocks/users.mock';

let localMockUsers = [...MOCK_USERS_DATA];

const BASE = '/users';

export const userApi = {
  async getPage(params: UserListParams): Promise<PaginatedResponse<User>> {
    try {
      return (await httpClient.get(`${BASE}/page`, {
        params,
      })) as unknown as PaginatedResponse<User>;
    } catch {
      // Fallback mock data when API is offline
      let filtered = [...localMockUsers];
      if (params.condition) {
        try {
          const parsed = JSON.parse(params.condition);
          if (parsed.email?.$regex) {
            const regex = new RegExp(parsed.email.$regex, 'i');
            filtered = filtered.filter(
              (u) =>
                regex.test(u.email) ||
                regex.test(`${u.lastName} ${u.firstName}`),
            );
          }
        } catch {
          // ignore parse error
        }
      }
      const page = params.page || 1;
      const limit = params.limit || 10;
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      return {
        data: paginated,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      };
    }
  },

  async getById(id: string): Promise<User> {
    try {
      return (await httpClient.get(`${BASE}/${id}`)) as unknown as User;
    } catch {
      const found = localMockUsers.find((u) => u.id === id);
      if (found) return found;
      return localMockUsers[0];
    }
  },

  async create(data: CreateUserPayload): Promise<User> {
    try {
      return (await httpClient.post(BASE, data)) as unknown as User;
    } catch {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        isActive: true,
        provider: 'local',
        createdAt: new Date().toISOString(),
        roles: ['user'],
        role: { id: 'r-3', code: 'user', name: 'Người dùng mới' },
      };
      localMockUsers.unshift(newUser);
      return newUser;
    }
  },

  async update(id: string, data: UpdateUserPayload): Promise<User> {
    try {
      return (await httpClient.put(`${BASE}/${id}`, data)) as unknown as User;
    } catch {
      const idx = localMockUsers.findIndex((u) => u.id === id);
      if (idx !== -1) {
        localMockUsers[idx] = { ...localMockUsers[idx], ...data };
        return localMockUsers[idx];
      }
      return localMockUsers[0];
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await httpClient.delete(`${BASE}/${id}`);
    } catch {
      localMockUsers = localMockUsers.filter((u) => u.id !== id);
    }
  },
};
