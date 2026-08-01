declare module "@itsc/shared" {
  export type ApiSuccessResponse<TData = unknown> = {
    success: true;
    message: string;
    data?: TData;
  };

  export type ApiErrorDetail = {
    code?: string;
    path?: string | string[];
    message?: string;
    details?: unknown;
  };

  export type ApiErrorResponse = {
    success: false;
    message: string;
    errors: ApiErrorDetail[];
  };
}

