"use client";

import { IconStack2, type Icon } from "@tabler/icons-react";

import { STATUS_CONFIG } from "@/components/submission/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetSubmissionStatsQuery } from "@/store/api/submissionApi";
import type { SubmissionStats } from "@/types";

const STAT_ITEMS: {
  key: keyof SubmissionStats;
  label: string;
  icon: Icon;
  className: string;
}[] = [
  {
    key: "total",
    label: "Total",
    icon: IconStack2,
    className: "bg-muted text-foreground",
  },
  { key: "pending", ...STATUS_CONFIG.PENDING },
  { key: "approved", ...STATUS_CONFIG.APPROVED },
  { key: "rejected", ...STATUS_CONFIG.REJECTED },
];

export function StatsCards() {
  const { data, isLoading, isError } = useGetSubmissionStatsQuery();

  return (
    <section
      aria-label="Submission stats"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {STAT_ITEMS.map(({ key, label, icon: StatIcon, className }) => (
        <Card key={key} size="sm">
          <CardContent className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-lg",
                className,
              )}
            >
              <StatIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-muted-foreground">{label}</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-6 w-10" />
              ) : (
                <p className="text-xl font-semibold tabular-nums">
                  {isError || !data ? "—" : data[key]}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
