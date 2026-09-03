import { ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  errorCode?: string;
  timestamp?: string;
}

export type TableAlign = 'left' | 'center' | 'right';

export interface ColumnDefinition<T> {
  key: string;
  header: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  width?: string;
  minWidth?: string;
  align?: TableAlign;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
}
