"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { parseReviewParams, toQueryString } from "@/lib/review-params";
import type { SubmissionListParams } from "@/types";

export function useReviewParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => parseReviewParams(searchParams),
    [searchParams],
  );

  const hrefFor = useCallback(
    (patch: Partial<SubmissionListParams>) =>
      `${pathname}${toQueryString({ ...params, ...patch })}`,
    [pathname, params],
  );

  const setParams = useCallback(
    (
      patch: Partial<SubmissionListParams>,
      { replace = false }: { replace?: boolean } = {},
    ) => {
      const resetsPage = Object.keys(patch).some((key) => key !== "page");
      const next = resetsPage ? { page: 1, ...patch } : patch;
      const navigate = replace ? router.replace : router.push;
      navigate(hrefFor(next), { scroll: false });
    },
    [router, hrefFor],
  );

  return { params, setParams, hrefFor };
}
