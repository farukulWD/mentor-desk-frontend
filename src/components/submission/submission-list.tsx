"use client";

import { IconAlertCircle, IconInbox } from "@tabler/icons-react";

import { SubmissionCard } from "@/components/submission/submission-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiError } from "@/lib/api-error";
import { useGetMySubmissionsQuery } from "@/store/api/submissionApi";

function SubmissionListSkeleton() {
  return (
    <ul
      className="flex flex-col gap-4"
      aria-busy="true"
      aria-label="Loading submissions"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <li key={index}>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20 rounded-4xl" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Skeleton className="h-4 w-64 max-w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function ListMessage({
  icon: MessageIcon,
  title,
  description,
  action,
}: {
  icon: typeof IconInbox;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
        <MessageIcon className="size-8 text-muted-foreground" />
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}

export function SubmissionList() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetMySubmissionsQuery();

  const renderContent = () => {
    if (isLoading) return <SubmissionListSkeleton />;

    if (isError) {
      return (
        <ListMessage
          icon={IconAlertCircle}
          title="Couldn't load submissions"
          description={getApiError(error).message}
          action={
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Retrying…" : "Try again"}
            </Button>
          }
        />
      );
    }

    if (!data?.length) {
      return (
        <ListMessage
          icon={IconInbox}
          title="No submissions yet"
          description="Submit your first project using the form."
        />
      );
    }

    return (
      <ul className="flex flex-col gap-4">
        {data.map((submission) => (
          <li key={submission.id}>
            <SubmissionCard submission={submission} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section
      aria-labelledby="my-submissions-heading"
      className="flex min-w-0 flex-col gap-4"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="my-submissions-heading" className="text-lg font-semibold">
          Your submissions
        </h2>
        {data && data.length > 0 && (
          <span className="text-sm text-muted-foreground tabular-nums">
            {data.length} total
          </span>
        )}
      </div>
      {renderContent()}
    </section>
  );
}
