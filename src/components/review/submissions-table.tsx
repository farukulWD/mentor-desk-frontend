"use client";

import {
  IconAlertCircle,
  IconBrandGithub,
  IconExternalLink,
  IconInbox,
  IconSearchOff,
  type Icon,
} from "@tabler/icons-react";

import { ReviewDialog } from "@/components/review/review-dialog";
import { SubmissionDetailsDialog } from "@/components/review/submission-details-dialog";
import { StatusBadge } from "@/components/submission/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { STATUS_FILTERS } from "@/lib/review-params";
import { cn } from "@/lib/utils";
import type { ReviewSubmission, StatusFilter } from "@/types";

const COLUMNS = [
  "Project",
  "Student",
  "Links",
  "Status",
  "Submitted",
  "Actions",
] as const;

const ICON_LINK_CLASS =
  "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

type SubmissionsTableProps = {
  rows: ReviewSubmission[] | undefined;
  rowCount: number;
  status: StatusFilter;
  search: string;
  isLoading: boolean;
  isFetching: boolean;
  errorMessage: string | null;
  onRetry: () => void;
};

function SkeletonRows({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton className="h-4 w-36" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-1.5 h-3 w-40" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-14" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-4xl" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-48" />
      </TableCell>
    </TableRow>
  ));
}

function MessageRow({
  icon: MessageIcon,
  title,
  description,
  action,
}: {
  icon: Icon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={COLUMNS.length} className="whitespace-normal">
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <MessageIcon className="size-8 text-muted-foreground" />
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground">{description}</p>
          {action}
        </div>
      </TableCell>
    </TableRow>
  );
}

function emptyMessage(status: StatusFilter, search: string) {
  if (search) {
    return {
      icon: IconSearchOff,
      title: `No results for “${search}”`,
      description: "Try a different project name or student email.",
    };
  }
  if (status === "ALL") {
    return {
      icon: IconInbox,
      title: "No submissions yet",
      description: "Student submissions will show up here.",
    };
  }
  const label = STATUS_FILTERS.find((filter) => filter.value === status)?.label;
  return {
    icon: IconInbox,
    title: `No ${label?.toLowerCase()} submissions`,
    description: "Nothing matches this filter right now.",
  };
}

export function SubmissionsTable({
  rows,
  rowCount,
  status,
  search,
  isLoading,
  isFetching,
  errorMessage,
  onRetry,
}: SubmissionsTableProps) {
  const renderBody = () => {
    if (isLoading) return <SkeletonRows count={rowCount} />;

    if (errorMessage) {
      return (
        <MessageRow
          icon={IconAlertCircle}
          title="Couldn't load submissions"
          description={errorMessage}
          action={
            <Button
              variant="outline"
              className="mt-2"
              onClick={onRetry}
              disabled={isFetching}
            >
              {isFetching ? "Retrying…" : "Try again"}
            </Button>
          }
        />
      );
    }

    if (!rows?.length) return <MessageRow {...emptyMessage(status, search)} />;

    return rows.map((submission) => (
      <TableRow key={submission.id}>
        <TableCell className="max-w-56">
          <p className="truncate font-medium" title={submission.projectName}>
            {submission.projectName}
          </p>
        </TableCell>
        <TableCell className="max-w-60">
          <p className="truncate">{submission.student.name}</p>
          <p
            className="truncate text-xs text-muted-foreground"
            title={submission.student.email}
          >
            {submission.student.email}
          </p>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-0.5">
            <a
              href={submission.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${submission.projectName}`}
              title={submission.repoUrl}
              className={ICON_LINK_CLASS}
            >
              <IconBrandGithub className="size-4" />
            </a>
            <a
              href={submission.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live site for ${submission.projectName}`}
              title={submission.liveUrl}
              className={ICON_LINK_CLASS}
            >
              <IconExternalLink className="size-4" />
            </a>
          </div>
        </TableCell>
        <TableCell>
          <StatusBadge status={submission.status} />
        </TableCell>
        <TableCell className="text-muted-foreground tabular-nums">
          {formatDate(submission.createdAt)}
        </TableCell>
        <TableCell>
          <div className="flex items-center justify-end gap-1">
            <SubmissionDetailsDialog submission={submission} />
            <ReviewDialog submission={submission} decision="APPROVED" />
            <ReviewDialog submission={submission} decision="REJECTED" />
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="rounded-xl ring-1 ring-foreground/10">
      <Table className="min-w-3xl">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {COLUMNS.map((column) => (
              <TableHead key={column}>
                {column === "Actions" ? (
                  <span className="sr-only">{column}</span>
                ) : (
                  column
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody
          aria-busy={isFetching}
          className={cn(
            "transition-opacity motion-reduce:transition-none",
            isFetching && !isLoading && "opacity-60",
          )}
        >
          {renderBody()}
        </TableBody>
      </Table>
    </div>
  );
}
