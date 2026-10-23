"use client";

import { useEffect, useRef, useState } from "react";

import { ReviewToolbar } from "@/components/review/review-toolbar";
import { StatsCards } from "@/components/review/stats-cards";
import { SubmissionsTable } from "@/components/review/submissions-table";
import { TablePagination } from "@/components/review/table-pagination";
import { useReviewParams } from "@/hooks/use-review-params";
import { getApiError } from "@/lib/api-error";
import { useGetSubmissionsQuery } from "@/store/api/submissionApi";

const SEARCH_DEBOUNCE_MS = 400;

export function ReviewDashboard() {
  const { params, setParams, hrefFor } = useReviewParams();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetSubmissionsQuery(params);

  const [searchInput, setSearchInput] = useState(params.search);
  const [syncedSearch, setSyncedSearch] = useState(params.search);
  const searchTimer = useRef<number | undefined>(undefined);
  const setParamsRef = useRef(setParams);

  if (params.search !== syncedSearch) {
    setSyncedSearch(params.search);
    setSearchInput(params.search);
  }

  useEffect(() => {
    setParamsRef.current = setParams;
  }, [setParams]);

  useEffect(() => () => window.clearTimeout(searchTimer.current), []);

  const totalPages = data?.meta.totalPages ?? 0;

  useEffect(() => {
    if (totalPages > 0 && params.page > totalPages) {
      setParams({ page: totalPages }, { replace: true });
    }
  }, [totalPages, params.page, setParams]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    window.clearTimeout(searchTimer.current);
    const commit = () =>
      setParamsRef.current({ search: value.trim() }, { replace: true });
    if (!value) commit();
    else searchTimer.current = window.setTimeout(commit, SEARCH_DEBOUNCE_MS);
  };

  const rows = data?.items;

  return (
    <div className="mt-6 flex flex-col gap-6">
      <StatsCards />
      <section
        aria-labelledby="review-queue-heading"
        className="flex min-w-0 flex-col gap-4"
      >
        <h2 id="review-queue-heading" className="text-lg font-semibold">
          Submissions
        </h2>
        <ReviewToolbar
          status={params.status}
          onStatusChange={(status) => setParams({ status })}
          search={searchInput}
          onSearchChange={handleSearchChange}
        />
        <SubmissionsTable
          rows={rows}
          rowCount={params.limit}
          status={params.status}
          search={params.search}
          isLoading={isLoading}
          isFetching={isFetching}
          errorMessage={isError ? getApiError(error).message : null}
          onRetry={() => refetch()}
        />
        {!isError && data && rows && rows.length > 0 && (
          <TablePagination
            meta={data.meta}
            hrefForPage={(page) => hrefFor({ page })}
            onPageChange={(page) => setParams({ page })}
            onLimitChange={(limit) => setParams({ limit })}
          />
        )}
      </section>
    </div>
  );
}
