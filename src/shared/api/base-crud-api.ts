import { httpClient } from './http-client';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** 13 Toán tử lọc nâng cao hỗ trợ bởi Backend NestJS MikroORM Filter */
export const OperatorType = {
  EQUAL: 'EQUAL',
  NOT_EQUAL: 'NOT_EQUAL',
  INCLUDE: 'INCLUDE',
  EXCLUDE: 'EXCLUDE',
  LIKE: 'LIKE',
  I_LIKE: 'I_LIKE',
  GREATER_THAN: 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL: 'GREATER_THAN_OR_EQUAL',
  LESS_THAN: 'LESS_THAN',
  LESS_THAN_OR_EQUAL: 'LESS_THAN_OR_EQUAL',
  BETWEEN: 'BETWEEN',
  IS_NULL: 'IS_NULL',
  IS_NOT_NULL: 'IS_NOT_NULL',
} as const;

export type OperatorType = (typeof OperatorType)[keyof typeof OperatorType];

/** Cấu trúc quy tắc lọc nâng cao (Advanced Filter Rule) */
export interface FilterRule<T = unknown> {
  field: keyof T | string | (keyof T | string)[];
  operator: OperatorType | `${OperatorType}`;
  values?: unknown;
}

/** Chuẩn hóa tham số lọc (Condition) truyền từ FE sang BE (Hỗ trợ cả Object phẳng và Mảng FilterRule nâng cao) */
export type BaseCrudCondition<T = unknown> =
  Partial<T> | Record<string, unknown> | FilterRule<T>[] | string;

/** Chuẩn hóa các tùy chọn truy vấn (Sort, Search, Select, Populate, Pagination) */
export interface BaseCrudQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string | string[];
  select?: string | string[];
  populate?: string | string[];
  [key: string]: unknown;
}

/** Tổng hợp toàn bộ tham số gửi kèm Request (Bao gồm cả condition & query) */
export interface BaseCrudRequestParams<
  T = unknown,
> extends BaseCrudQueryOptions {
  condition?: BaseCrudCondition<T>;
}

export class BaseCrudApi<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  protected readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /** Chuẩn hóa params trước khi gửi (Tự động stringify object/array condition cho NestJS ConditionQueryPipe) */
  protected formatParams(
    params?: BaseCrudRequestParams<T>,
  ): Record<string, unknown> | undefined {
    if (!params) return undefined;
    const formatted: Record<string, unknown> = { ...params };
    if (formatted.condition && typeof formatted.condition === 'object') {
      formatted.condition = JSON.stringify(formatted.condition);
    }
    return formatted;
  }

  /** GET /page — Lấy danh sách có phân trang + condition + query options */
  async getPage(
    params?: BaseCrudRequestParams<T>,
  ): Promise<PaginatedResult<T>> {
    return (await httpClient.get(`${this.endpoint}/page`, {
      params: this.formatParams(params),
    })) as unknown as PaginatedResult<T>;
  }

  /** GET /many — Lấy danh sách mảng nhiều bản ghi theo condition + query options */
  async getMany(params?: BaseCrudRequestParams<T>): Promise<T[]> {
    return (await httpClient.get(`${this.endpoint}/many`, {
      params: this.formatParams(params),
    })) as unknown as T[];
  }

  /** GET /one — Lấy 1 bản ghi duy nhất theo condition */
  async getOne(params?: BaseCrudRequestParams<T>): Promise<T> {
    return (await httpClient.get(`${this.endpoint}/one`, {
      params: this.formatParams(params),
    })) as unknown as T;
  }

  /** GET /:id — Lấy 1 bản ghi theo ID + query options (VD: populate) */
  async getById(id: string, params?: BaseCrudQueryOptions): Promise<T> {
    return (await httpClient.get(`${this.endpoint}/${id}`, {
      params,
    })) as unknown as T;
  }

  /** POST / — Tạo mới 1 bản ghi */
  async create(data: CreateDto): Promise<T> {
    return (await httpClient.post(this.endpoint, data)) as unknown as T;
  }

  /** PUT /one — Cập nhật bản ghi thỏa mãn condition */
  async updateOne(
    params: BaseCrudRequestParams<T>,
    data: UpdateDto,
  ): Promise<T> {
    return (await httpClient.put(`${this.endpoint}/one`, data, {
      params: this.formatParams(params),
    })) as unknown as T;
  }

  /** PUT /:id — Cập nhật 1 bản ghi theo ID */
  async updateById(id: string, data: UpdateDto): Promise<T> {
    return (await httpClient.put(
      `${this.endpoint}/${id}`,
      data,
    )) as unknown as T;
  }

  /** Alias cho updateById */
  async update(id: string, data: UpdateDto): Promise<T> {
    return this.updateById(id, data);
  }

  /** PUT /many/ids — Cập nhật hàng loạt theo danh sách ID */
  async updateManyByIds(
    ids: string[],
    update: UpdateDto,
  ): Promise<{ affected: number }> {
    return (await httpClient.put(`${this.endpoint}/many/ids`, {
      ids,
      update,
    })) as unknown as { affected: number };
  }

  /** DELETE /one — Xóa bản ghi thỏa mãn condition */
  async deleteOne(params: BaseCrudRequestParams<T>): Promise<void> {
    await httpClient.delete(`${this.endpoint}/one`, {
      params: this.formatParams(params),
    });
  }

  /** DELETE /:id — Xóa 1 bản ghi theo ID */
  async deleteById(id: string): Promise<void> {
    await httpClient.delete(`${this.endpoint}/${id}`);
  }

  /** Alias cho deleteById */
  async delete(id: string): Promise<void> {
    return this.deleteById(id);
  }

  /** DELETE /many/ids — Xóa hàng loạt bản ghi theo danh sách IDs */
  async deleteManyByIds(ids: string[]): Promise<{ deleted: number }> {
    return (await httpClient.delete(`${this.endpoint}/many/ids`, {
      data: { ids },
    })) as unknown as { deleted: number };
  }
}

/**
 * Factory helper để khởi tạo nhanh API client chuẩn cho bất kỳ Module Backend nào.
 * Khớp 100% với 11 routes của BaseCrudControllerFactory ở Backend NestJS.
 */
export function createBaseCrudApi<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
>(endpoint: string) {
  return new BaseCrudApi<T, CreateDto, UpdateDto>(endpoint);
}
