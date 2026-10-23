export type Role = "STUDENT" | "MENTOR";

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type StatusFilter = "ALL" | SubmissionStatus;

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type Submission = {
  id: string;
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: SubmissionStatus;
  feedback: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReviewSubmission = Submission & {
  student: Pick<User, "id" | "name" | "email">;
  reviewedBy: Pick<User, "id" | "name"> | null;
};

export type SubmissionStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};
