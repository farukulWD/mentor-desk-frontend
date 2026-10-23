import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { SubmissionForm } from "@/components/submission/submission-form";
import { SubmissionList } from "@/components/submission/submission-list";

export const instant = false;

export const metadata: Metadata = { title: "My submissions" };

export default function StudentPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold tracking-tight">My submissions</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-20">
          <SubmissionForm />
        </div>
        <SubmissionList />
      </div>
    </PageContainer>
  );
}
