import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import type { ApiError, ApiMeta } from "@/types/api";

import { axiosBaseQuery, type AxiosBaseQueryArgs } from "./axiosBaseQuery";

const NO_REDIRECT_PATHS = ["/auth/login", "/auth/signup", "/auth/me"];

export const baseQueryWithReauth: BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  ApiError,
  object,
  ApiMeta
> = async (args, api, extraOptions) => {
  const result = await axiosBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || typeof window === "undefined") return result;
  if (NO_REDIRECT_PATHS.some((path) => args.url.startsWith(path))) return result;

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }

  return result;
};
