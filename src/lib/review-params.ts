import type { StatusFilter, SubmissionListParams } from "@/types";

export const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export const PAGE_SIZES = [10, 20, 50] as const;

export const SEARCH_MAX_LENGTH = 100;

export const DEFAULT_REVIEW_PARAMS: SubmissionListParams = {
  status: "ALL",
  page: 1,
  limit: PAGE_SIZES[0],
  search: "",
};

type ReadableParams = { get: (key: string) => string | null };

const isStatusFilter = (value: string): value is StatusFilter =>
  STATUS_FILTERS.some((filter) => filter.value === value);

const toPositiveInt = (value: string | null) => {
  if (!value || !/^\d+$/.test(value)) return null;
  const number = Number(value);
  return number >= 1 ? number : null;
};

export const parseReviewParams = (
  searchParams: ReadableParams,
): SubmissionListParams => {
  const status = searchParams.get("status")?.toUpperCase() ?? "";
  const limit = toPositiveInt(searchParams.get("limit"));

  return {
    status: isStatusFilter(status) ? status : DEFAULT_REVIEW_PARAMS.status,
    page: toPositiveInt(searchParams.get("page")) ?? DEFAULT_REVIEW_PARAMS.page,
    limit: PAGE_SIZES.some((size) => size === limit)
      ? (limit as number)
      : DEFAULT_REVIEW_PARAMS.limit,
    search: (searchParams.get("search") ?? "")
      .trim()
      .slice(0, SEARCH_MAX_LENGTH),
  };
};

export const toQueryString = (params: SubmissionListParams) => {
  const query = new URLSearchParams();

  if (params.status !== DEFAULT_REVIEW_PARAMS.status) {
    query.set("status", params.status.toLowerCase());
  }
  if (params.search) query.set("search", params.search);
  if (params.limit !== DEFAULT_REVIEW_PARAMS.limit) {
    query.set("limit", String(params.limit));
  }
  if (params.page !== DEFAULT_REVIEW_PARAMS.page) {
    query.set("page", String(params.page));
  }

  const value = query.toString();
  return value ? `?${value}` : "";
};
