import type { SerializedError } from "@reduxjs/toolkit";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { getApiError } from "@/lib/api-error";
import { applyServerErrors } from "@/lib/form-errors";
import type { ApiError } from "@/types/api";

const RATE_LIMIT_SECONDS = 60;

type HandleAuthErrorOptions<T extends FieldValues> = {
  error: unknown;
  setError: UseFormSetError<T>;
  fields: readonly Path<T>[];
  startCooldown: (seconds: number) => void;
};

export const handleAuthError = <T extends FieldValues>({
  error,
  setError,
  fields,
  startCooldown,
}: HandleAuthErrorOptions<T>) => {
  const { status, message, errors } = getApiError(
    error as ApiError | SerializedError,
  );

  if (status === 429) {
    startCooldown(RATE_LIMIT_SECONDS);
    setError("root", { type: "server", message });
    toast.error(message);
    return;
  }

  if (applyServerErrors(setError, errors, fields)) return;

  if (status === 401 || status === 409) {
    setError("root", { type: "server", message });
    return;
  }

  toast.error(message);
};
