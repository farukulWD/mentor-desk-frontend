import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";

export const instant = false;

export const metadata: Metadata = { title: "My submissions" };

export default function StudentPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold tracking-tight">My submissions</h1>
    </PageContainer>
  );
}
