import type { SerializedError } from "@reduxjs/toolkit";
import type { ApiError } from "@/types/api";

export type ParsedApiError = {
  status: number | null;
  message: string;
  errors?: Record<string, string>;
};

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

export const getApiError = (
  error: ApiError | SerializedError | undefined,
): ParsedApiError => {
  if (!error) return { status: null, message: FALLBACK_MESSAGE };

  if ("status" in error) {
    return {
      status: typeof error.status === "number" ? error.status : null,
      message: error.message,
      errors: error.errors,
    };
  }

  return { status: null, message: error.message ?? FALLBACK_MESSAGE };
};
