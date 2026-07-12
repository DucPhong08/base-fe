import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from './api/user-api';
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserListParams,
} from './types';

const USERS_KEY = 'users';

export function useUsersQuery(params: UserListParams) {
  return useQuery({
    queryKey: [USERS_KEY, 'page', params],
    queryFn: () => userApi.getPage(params),
  });
}

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: [USERS_KEY, 'detail', id],
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserPayload) => userApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
      userApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}
