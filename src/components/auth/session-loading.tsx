import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export function SessionLoading() {
  return (
    <>
      <div className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="ml-auto h-6 w-24" />
        </div>
      </div>
      <PageContainer aria-busy="true" aria-label="Loading">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </PageContainer>
    </>
  );
}
