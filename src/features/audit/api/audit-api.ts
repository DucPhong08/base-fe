import { BaseCrudApi } from '../../../shared/api/base-crud-api';
import { httpClient } from '../../../shared/api/http-client';

export interface AuditLogRecord {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  changes?: Record<string, unknown>;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  description?: string;
  createdAt: string;
}

class AuditLogApi extends BaseCrudApi<AuditLogRecord> {
  constructor() {
    super('/audit-logs');
  }

  async getRecentLogs(limit = 50): Promise<AuditLogRecord[]> {
    return (await httpClient.get(`${this.endpoint}/recent`, {
      params: { limit },
    })) as unknown as AuditLogRecord[];
  }

  async getUserLogs(userId: string, limit = 50): Promise<AuditLogRecord[]> {
    return (await httpClient.get(`${this.endpoint}/user/${userId}`, {
      params: { limit },
    })) as unknown as AuditLogRecord[];
  }
}

export const auditApi = new AuditLogApi();
