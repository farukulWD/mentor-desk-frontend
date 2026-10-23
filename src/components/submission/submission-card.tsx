import { IconBrandGithub, IconExternalLink } from "@tabler/icons-react";

import { ResubmitDialog } from "@/components/submission/resubmit-dialog";
import { StatusBadge } from "@/components/submission/status-badge";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EXTERNAL_LINK_CLASS,
  formatDate,
  formatLiveUrl,
  formatRepo,
} from "@/lib/format";
import type { Submission } from "@/types";

export function SubmissionCard({ submission }: { submission: Submission }) {
  const {
    projectName,
    repoUrl,
    liveUrl,
    description,
    status,
    feedback,
    reviewedAt,
    createdAt,
  } = submission;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="min-w-0 text-base wrap-break-word">
          {projectName}
        </CardTitle>
        <CardAction>
          <StatusBadge status={status} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-4">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={EXTERNAL_LINK_CLASS}
          >
            <IconBrandGithub className="size-4 shrink-0" />
            <span className="truncate">{formatRepo(repoUrl)}</span>
          </a>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={EXTERNAL_LINK_CLASS}
          >
            <IconExternalLink className="size-4 shrink-0" />
            <span className="truncate">{formatLiveUrl(liveUrl)}</span>
          </a>
        </div>
        <p className="line-clamp-3 whitespace-pre-line wrap-break-word">
          {description}
        </p>
        {reviewedAt && (
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground">
              Mentor feedback · Reviewed {formatDate(reviewedAt)}
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
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/30 py-3">
        <span className="text-xs text-muted-foreground">
          Submitted {formatDate(createdAt)}
        </span>
        {status === "REJECTED" && <ResubmitDialog submission={submission} />}
      </CardFooter>
    </Card>
  );
}
