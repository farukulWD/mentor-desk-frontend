import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { SubmissionForm } from "@/components/submission/submission-form";

export const instant = false;

export const metadata: Metadata = { title: "My submissions" };

export default function StudentPage() {
  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-2xl font-semibold tracking-tight">My submissions</h1>
        <div className="mt-6">
          <SubmissionForm />
        </div>
      </div>
    </PageContainer>
  );
}
