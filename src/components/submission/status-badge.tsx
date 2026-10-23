import {
  IconCircleCheck,
  IconCircleX,
  IconClock,
  type Icon,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/types";

export const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; icon: Icon; className: string }
> = {
  PENDING: {
    label: "Pending",
    icon: IconClock,
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  APPROVED: {
    label: "Approved",
    icon: IconCircleCheck,
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    icon: IconCircleX,
    className: "bg-destructive/10 text-destructive dark:bg-destructive/20",
  },
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const { label, icon: StatusIcon, className } = STATUS_CONFIG[status];

  return (
    <Badge className={className}>
      <StatusIcon data-icon="inline-start" />
      {label}
    </Badge>
  );
}
