import { z } from "zod";

export const FEEDBACK_MAX = 500;

export const reviewSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"]),
    feedback: z
      .string()
      .trim()
      .max(FEEDBACK_MAX, `Feedback must be at most ${FEEDBACK_MAX} characters`),
  })
  .superRefine((data, ctx) => {
    if (data.status === "REJECTED" && !data.feedback) {
      ctx.addIssue({
        code: "custom",
        path: ["feedback"],
        message: "Feedback is required when rejecting",
      });
    }
  });

export type ReviewValues = z.infer<typeof reviewSchema>;

export type ReviewDecision = ReviewValues["status"];
