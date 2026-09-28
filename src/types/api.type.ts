export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: PaginationMeta | null;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: unknown[] | null;
}
