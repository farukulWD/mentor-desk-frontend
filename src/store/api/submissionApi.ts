import type { Submission } from "@/types";
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
  }),
});

export const {
  useGetMySubmissionsQuery,
  useCreateSubmissionMutation,
  useResubmitSubmissionMutation,
} = submissionApi;
