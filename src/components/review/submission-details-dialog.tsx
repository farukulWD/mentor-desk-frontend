"use client";

import {
  IconBrandGithub,
  IconExternalLink,
  IconEye,
} from "@tabler/icons-react";

import { StatusBadge } from "@/components/submission/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  EXTERNAL_LINK_CLASS,
  formatDate,
  formatLiveUrl,
  formatRepo,
} from "@/lib/format";
import type { ReviewSubmission } from "@/types";

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

export function SubmissionDetailsDialog({
  submission,
}: {
  submission: ReviewSubmission;
}) {
  const {
    projectName,
    repoUrl,
    liveUrl,
    description,
    status,
    feedback,
    reviewedAt,
    reviewedBy,
    createdAt,
    student,
  } = submission;

  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="ghost" size="sm" />}
        aria-label={`View details for ${projectName}`}
      >
        <IconEye data-icon="inline-start" />
        View
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-8 wrap-break-word">{projectName}</DialogTitle>
          <DialogDescription>
            Submitted {formatDate(createdAt)}
          </DialogDescription>
        </DialogHeader>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <DetailItem label="Student">
            <p className="truncate font-medium">{student.name}</p>
            <p className="truncate text-muted-foreground">{student.email}</p>
          </DetailItem>
          <DetailItem label="Status">
            <StatusBadge status={status} />
          </DetailItem>
          <DetailItem label="Repository">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={EXTERNAL_LINK_CLASS}
            >
              <IconBrandGithub className="size-4 shrink-0" />
              <span className="truncate">{formatRepo(repoUrl)}</span>
            </a>
          </DetailItem>
          <DetailItem label="Live site">
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={EXTERNAL_LINK_CLASS}
            >
              <IconExternalLink className="size-4 shrink-0" />
              <span className="truncate">{formatLiveUrl(liveUrl)}</span>
            </a>
          </DetailItem>
          <div className="sm:col-span-2">
            <DetailItem label="Description">
              <p className="whitespace-pre-line wrap-break-word">
                {description}
              </p>
            </DetailItem>
          </div>
          {reviewedAt && (
            <div className="rounded-lg bg-muted px-3 py-2 sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">
                Reviewed {formatDate(reviewedAt)}
                {reviewedBy && ` by ${reviewedBy.name}`}
              </p>
              <p className="mt-1 whitespace-pre-line wrap-break-word">
                {feedback ?? (
                  <span className="text-muted-foreground italic">
                    No feedback left
                  </span>
                )}
              </p>
            </div>
          )}
        </dl>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
