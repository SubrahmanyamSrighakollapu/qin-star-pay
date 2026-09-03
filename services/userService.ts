import {
  BusinessEntity,
  EntityMapping,
  UserFilters,
  PaginationState,
  EntityType,
} from '@/types/domain';
import { ApiResponse } from '@/types/common';
import { mockEntities, mockEntityMappings } from '@/mocks/mockUsers';
import { apiClient } from './apiClient';
import { APP_CONFIG } from '@/config';

const inMemoryEntities: BusinessEntity[] = [...mockEntities];
const inMemoryMappings: EntityMapping[] = [...mockEntityMappings];

export interface EntityListResult {
  items: BusinessEntity[];
  pagination: PaginationState;
}

export interface MappingListResult {
  items: EntityMapping[];
  pagination: PaginationState;
}

export const userService = {
  /**
   * Fetch entities by type with filtering and pagination.
   */
  async getEntities(
    type: EntityType,
    filters?: UserFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<EntityListResult>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      let filtered = inMemoryEntities.filter((e) => e.type === type);

      if (filters?.status && filters.status !== 'ALL') {
        filtered = filtered.filter((e) => e.status === filters.status);
      }

      if (filters?.kycStatus && filters.kycStatus !== 'ALL') {
        filtered = filtered.filter((e) => e.kycStatus === filters.kycStatus);
      }

      if (filters?.role && filters.role !== 'ALL') {
        filtered = filtered.filter((e) => e.role === filters.role);
      }

      if (filters?.distributorId && filters.distributorId !== 'ALL') {
        filtered = filtered.filter(
          (e) => e.parentId === filters.distributorId || e.parentName === filters.distributorId
        );
      }

      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.code.toLowerCase().includes(q) ||
            e.name.toLowerCase().includes(q) ||
            e.businessName.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.mobile.includes(q)
        );
      }

      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const startIndex = (page - 1) * pageSize;
      const items = filtered.slice(startIndex, startIndex + pageSize);

      return {
        success: true,
        data: {
          items,
          pagination: { page, pageSize, totalItems, totalPages },
        },
        timestamp: new Date().toISOString(),
      };
    }

    return apiClient.get<ApiResponse<EntityListResult>>('/users', {
      params: { type, ...filters, page, pageSize } as unknown as Record<string, string | number | boolean>,
    });
  },

  async getDistributors(filters?: UserFilters, page = 1, pageSize = 10) {
    return this.getEntities('DISTRIBUTOR', filters, page, pageSize);
  },

  async getRetailers(filters?: UserFilters, page = 1, pageSize = 10) {
    return this.getEntities('RETAILER', filters, page, pageSize);
  },

  async getMerchants(filters?: UserFilters, page = 1, pageSize = 10) {
    return this.getEntities('MERCHANT', filters, page, pageSize);
  },

  async getBackOfficeUsers(filters?: UserFilters, page = 1, pageSize = 10) {
    return this.getEntities('BACK_OFFICE', filters, page, pageSize);
  },

  async getUserById(id: string): Promise<ApiResponse<BusinessEntity | null>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));
      const entity = inMemoryEntities.find((e) => e.id === id || e.code === id) || null;
      return {
        success: !!entity,
        data: entity,
        timestamp: new Date().toISOString(),
      };
    }
    return apiClient.get<ApiResponse<BusinessEntity>>(`/users/${id}`);
  },

  async blockUser(id: string, reason?: string): Promise<ApiResponse<BusinessEntity>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 300));
      const entity = inMemoryEntities.find((e) => e.id === id || e.code === id);
      if (entity) {
        entity.status = 'BLOCKED';
        entity.blockedAt = new Date().toISOString();
        entity.blockedBy = 'Super Admin';
        entity.blockedReason = reason || 'Admin security lock';
        return {
          success: true,
          data: { ...entity },
          timestamp: new Date().toISOString(),
        };
      }
      return { success: false, data: null as unknown as BusinessEntity, timestamp: new Date().toISOString() };
    }
    return apiClient.post<ApiResponse<BusinessEntity>>(`/users/${id}/block`, { reason });
  },

  async unblockUser(id: string): Promise<ApiResponse<BusinessEntity>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 300));
      const entity = inMemoryEntities.find((e) => e.id === id || e.code === id);
      if (entity) {
        entity.status = 'ACTIVE';
        entity.blockedAt = undefined;
        entity.blockedBy = undefined;
        entity.blockedReason = undefined;
        return {
          success: true,
          data: { ...entity },
          timestamp: new Date().toISOString(),
        };
      }
      return { success: false, data: null as unknown as BusinessEntity, timestamp: new Date().toISOString() };
    }
    return apiClient.post<ApiResponse<BusinessEntity>>(`/users/${id}/unblock`);
  },

  async requestPasswordReset(
    id: string,
    mode: 'LINK' | 'TEMP_PASSWORD'
  ): Promise<ApiResponse<{ message: string; tempPassword?: string }>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 300));
      if (mode === 'TEMP_PASSWORD') {
        const tempPassword = `QinStar@${Math.floor(100000 + Math.random() * 900000)}`;
        return {
          success: true,
          data: {
            message: 'Temporary password generated successfully.',
            tempPassword,
          },
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: true,
        data: { message: 'Password reset link sent to user email & SMS.' },
        timestamp: new Date().toISOString(),
      };
    }
    return apiClient.post<ApiResponse<{ message: string }>>(`/users/${id}/reset-password`, { mode });
  },

  async getMappings(): Promise<ApiResponse<MappingListResult>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        success: true,
        data: {
          items: inMemoryMappings,
          pagination: { page: 1, pageSize: 10, totalItems: inMemoryMappings.length, totalPages: 1 },
        },
        timestamp: new Date().toISOString(),
      };
    }
    return apiClient.get<ApiResponse<MappingListResult>>('/users/mappings');
  },

  async updateMapping(
    mappingId: string,
    newParentId: string,
    newParentName: string
  ): Promise<ApiResponse<EntityMapping>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 300));
      const mapItem = inMemoryMappings.find((m) => m.id === mappingId);
      if (mapItem) {
        mapItem.mappedParentId = newParentId;
        mapItem.mappedParentName = newParentName;
        mapItem.effectiveDate = new Date().toISOString().split('T')[0];

        const entity = inMemoryEntities.find((e) => e.id === mapItem.entityId);
        if (entity) {
          entity.parentId = newParentId;
          entity.parentName = newParentName;
        }

        return { success: true, data: { ...mapItem }, timestamp: new Date().toISOString() };
      }
      return { success: false, data: null as unknown as EntityMapping, timestamp: new Date().toISOString() };
    }
    return apiClient.put<ApiResponse<EntityMapping>>(`/users/mappings/${mappingId}`, { newParentId });
  },
};
