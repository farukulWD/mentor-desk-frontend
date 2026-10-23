"use client";

import { AppHeader } from "@/components/layout/app-header";
import { ErrorState } from "@/components/layout/error-state";
import { AuthContainer } from "@/components/layout/page-container";

export default function RootError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <>
      <AppHeader />
      <AuthContainer>
        <ErrorState
          title="Something went wrong"
          description="An unexpected error occurred. Try again, or head back home."
          error={error}
          onRetry={retry}
        />
      </AuthContainer>
    </>
  );
}
