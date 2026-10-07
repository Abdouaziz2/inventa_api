export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  timestamp?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
