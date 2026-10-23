"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZES } from "@/lib/review-params";
import { cn } from "@/lib/utils";
import type { Meta } from "@/types/api";

type TablePaginationProps = {
  meta: Meta;
  hrefForPage: (page: number) => string;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const pageWindow = (page: number, totalPages: number) => {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  return sorted.flatMap((value, index) =>
    index > 0 && value - sorted[index - 1] > 1
      ? (["ellipsis", value] as const)
      : ([value] as const),
  );
};

export function TablePagination({
  meta,
  hrefForPage,
  onPageChange,
  onLimitChange,
}: TablePaginationProps) {
  const { page, limit, total, totalPages } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const linkProps = (target: number, disabled = false) => ({
    href: hrefForPage(target),
    "aria-disabled": disabled || undefined,
    tabIndex: disabled ? -1 : undefined,
    className: cn(disabled && "pointer-events-none opacity-50"),
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      if (!disabled) onPageChange(target);
    },
  });

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="tabular-nums" aria-live="polite">
          Showing {from}–{to} of {total}
        </span>
        <Select
          value={limit}
          onValueChange={(value) => value && onLimitChange(value)}
          items={PAGE_SIZES.map((size) => ({
            value: size,
            label: `${size} / page`,
          }))}
        >
          <SelectTrigger size="sm" aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious {...linkProps(page - 1, page <= 1)} />
            </PaginationItem>
            {pageWindow(page, totalPages).map((item, index) =>
              item === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    isActive={item === page}
                    {...linkProps(item)}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext {...linkProps(page + 1, page >= totalPages)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
