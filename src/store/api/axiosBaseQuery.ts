import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, type AxiosRequestConfig } from "axios";

import type { ApiEnvelope, ApiError, ApiErrorEnvelope, ApiMeta } from "@/types/api";

import axiosInstance from "./axiosInstance";

export type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
  contentType?: string;
};

function isErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as ApiErrorEnvelope).message === "string"
  );
}

function normaliseError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const body = error.response?.data;
    const status = error.response?.status;

    if (status !== undefined) {
      if (isErrorEnvelope(body)) {
        return { status, message: body.message, errors: body.errors };
      }
      if (status === 429) {
        return { status, message: "Too many attempts. Try again later." };
      }
      return { status, message: `Request failed (${status})` };
    }

    if (error.code === AxiosError.ECONNABORTED || error.code === AxiosError.ETIMEDOUT) {
      return { status: "TIMEOUT_ERROR", message: "The server took too long to respond." };
    }

    return { status: "FETCH_ERROR", message: "Cannot reach server. Check your connection." };
  }

  return { status: "CUSTOM_ERROR", message: "Something went wrong. Please try again." };
}

export const axiosBaseQuery: BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  ApiError,
  object,
  ApiMeta
> = async ({ url, method = "GET", data, params, headers, contentType }) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data: method === "GET" ? undefined : data,
      params,
      headers: {
        ...headers,
        ...(data instanceof FormData
          ? {}
          : { "Content-Type": contentType ?? "application/json" }),
      },
    });

    const envelope = response.data as ApiEnvelope<unknown> | undefined;

    return { data: envelope?.data, meta: { meta: envelope?.meta } };
  } catch (error) {
    return { error: normaliseError(error) };
  }
};
