"use client";

import { ErrorState } from "@/components/layout/error-state";
import { PageContainer } from "@/components/layout/page-container";

export function SegmentError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <PageContainer className="grid place-items-center">
      <ErrorState
        title="Something went wrong"
        description="This page failed to load. Try again, or head back home."
        error={error}
        onRetry={retry}
      />
    </PageContainer>
  );
}
