import { z } from "zod";

export const DESCRIPTION_MAX = 1000;

const GITHUB_REPO_REGEX =
  /^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\.git)?\/?$/i;

export const submissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be at most 100 characters"),
  repoUrl: z
    .string()
    .trim()
    .min(1, "Repository URL is required")
    .regex(
      GITHUB_REPO_REGEX,
      "Must be a GitHub repo URL (https://github.com/owner/repo)",
    ),
  liveUrl: z
    .string()
    .trim()
    .min(1, "Live URL is required")
    .pipe(z.url({ protocol: /^https?$/, message: "Invalid live URL" })),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(DESCRIPTION_MAX, `Description must be at most ${DESCRIPTION_MAX} characters`),
});

export type SubmissionValues = z.infer<typeof submissionSchema>;
