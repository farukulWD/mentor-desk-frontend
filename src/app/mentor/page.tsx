import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";

export const instant = false;

export const metadata: Metadata = { title: "Review dashboard" };

export default function MentorPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold tracking-tight">Review dashboard</h1>
    </PageContainer>
  );
}
