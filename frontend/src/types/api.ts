export type ApiResponse<T = any> = {
  ok: boolean;
  data?: T;
  error?: string | null;
  status?: number;
};

export type ListResponse<T> = ApiResponse<T[]> & {
  total?: number;
};

export type ApiError = {
  message: string;
  code?: string | number;
};
