import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import type { ApiError, ApiMeta } from "@/types/api";

import { axiosBaseQuery, type AxiosBaseQueryArgs } from "./axiosBaseQuery";

const NO_REFRESH_PATHS = ["/auth/login", "/auth/signup", "/auth/refresh", "/auth/logout"];
const NO_REDIRECT_PATHS = ["/auth/me"];

type BaseQueryApi = Parameters<typeof axiosBaseQuery>[1];

let refreshing: Promise<boolean> | null = null;

function refreshTokens(api: BaseQueryApi) {
  refreshing ??= Promise.resolve(
    axiosBaseQuery({ url: "/auth/refresh", method: "POST" }, api, {}),
  )
    .then((result) => !result.error)
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
}

export const baseQueryWithReauth: BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  ApiError,
  object,
  ApiMeta
> = async (args, api, extraOptions) => {
  const result = await axiosBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || typeof window === "undefined") return result;
  if (NO_REFRESH_PATHS.some((path) => args.url.startsWith(path))) return result;

  if (await refreshTokens(api)) {
    return axiosBaseQuery(args, api, extraOptions);
  }

  if (NO_REDIRECT_PATHS.some((path) => args.url.startsWith(path))) return result;

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }

  return result;
};
