"use client";

import { IconSearch, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEARCH_MAX_LENGTH, STATUS_FILTERS } from "@/lib/review-params";
import type { StatusFilter } from "@/types";

type ReviewToolbarProps = {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  search: string;
  onSearchChange: (search: string) => void;
};

export function ReviewToolbar({
  status,
  onStatusChange,
  search,
  onSearchChange,
}: ReviewToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Tabs
        value={status}
        onValueChange={(value) => onStatusChange(value as StatusFilter)}
      >
        <TabsList className="w-full sm:w-fit">
          {STATUS_FILTERS.map((filter) => (
            <TabsTrigger key={filter.value} value={filter.value}>
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="relative w-full sm:max-w-xs">
        <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Search by project name or student email"
          placeholder="Search project or student email"
          value={search}
          maxLength={SEARCH_MAX_LENGTH}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
            className="absolute top-1/2 right-1 -translate-y-1/2"
          >
            <IconX />
          </Button>
        )}
      </div>
    </div>
  );
}
