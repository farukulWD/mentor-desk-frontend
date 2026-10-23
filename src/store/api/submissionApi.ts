import type {
  Paginated,
  ReviewSubmission,
  Submission,
  SubmissionListParams,
  SubmissionStats,
} from "@/types";
import type { ApiMeta } from "@/types/api";
import type { ReviewValues } from "@/lib/validations/review";
import type { SubmissionValues } from "@/lib/validations/submission";

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export const submissionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMySubmissions: build.query<Submission[], void>({
      query: () => ({ url: "/submissions/me" }),
      providesTags: [tagTypes.submission],
    }),
    createSubmission: build.mutation<Submission, SubmissionValues>({
      query: (data) => ({ url: "/submissions", method: "POST", data }),
      invalidatesTags: [tagTypes.submission],
    }),
    resubmitSubmission: build.mutation<
      Submission,
      SubmissionValues & { id: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/submissions/${id}/resubmit`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.submission, tagTypes.stats],
    }),
    getSubmissions: build.query<
      Paginated<ReviewSubmission>,
      SubmissionListParams
    >({
      query: ({ search, ...params }) => ({
        url: "/submissions",
        params: search ? { ...params, search } : params,
      }),
      transformResponse: (
        items: ReviewSubmission[],
        meta: ApiMeta | undefined,
        { page, limit },
      ) => ({
        items,
        meta: meta?.meta ?? {
          page,
          limit,
          total: items.length,
          totalPages: items.length ? 1 : 0,
        },
      }),
      providesTags: [tagTypes.submission],
    }),
    getSubmissionStats: build.query<SubmissionStats, void>({
      query: () => ({ url: "/submissions/stats" }),
      providesTags: [tagTypes.stats],
    }),
    reviewSubmission: build.mutation<
      ReviewSubmission,
      ReviewValues & { id: string }
    >({
      query: ({ id, status, feedback }) => ({
        url: `/submissions/${id}/review`,
        method: "PATCH",
        data: feedback ? { status, feedback } : { status },
      }),
      invalidatesTags: [tagTypes.submission, tagTypes.stats],
    }),
  }),
});

export const {
  useGetMySubmissionsQuery,
  useCreateSubmissionMutation,
  useResubmitSubmissionMutation,
  useGetSubmissionsQuery,
  useGetSubmissionStatsQuery,
  useReviewSubmissionMutation,
} = submissionApi;
