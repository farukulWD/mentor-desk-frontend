export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiEnvelope<T> = {
  success: true;
  message: string;
  data: T;
  meta?: Meta;
};

export type ApiErrorEnvelope = {
  success: false;
  message: string;
  errors?: Record<string, string>;
  stack?: string;
};

export type ApiError = {
  status: number | "FETCH_ERROR" | "TIMEOUT_ERROR" | "CUSTOM_ERROR";
  message: string;
  errors?: Record<string, string>;
};

export type ApiMeta = {
  meta?: Meta;
};
