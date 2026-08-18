import { BaseCrudApi } from '../../../shared/api/base-crud-api';
import { httpClient } from '../../../shared/api/http-client';

export interface SystemSetting {
  key: string;
  value: unknown;
}

class SettingApi extends BaseCrudApi<SystemSetting> {
  constructor() {
    super('/settings');
  }

  async getByKey(key: string): Promise<SystemSetting | null> {
    return (await httpClient.get(
      `${this.endpoint}/key/${key}`,
    )) as unknown as SystemSetting | null;
  }

  async updateValueByKey(key: string, value: unknown): Promise<SystemSetting> {
    return (await httpClient.put(`${this.endpoint}/key/${key}/value`, {
      value,
    })) as unknown as SystemSetting;
  }
}

export const settingApi = new SettingApi();
