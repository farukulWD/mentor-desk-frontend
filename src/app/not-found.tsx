import { IconMapOff } from "@tabler/icons-react";
import type { Metadata } from "next";

import { AppHeader } from "@/components/layout/app-header";
import { ErrorState } from "@/components/layout/error-state";
import { AuthContainer } from "@/components/layout/page-container";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <AppHeader />
      <AuthContainer>
        <ErrorState
          icon={<IconMapOff />}
          title="Page not found"
          description="The page you are looking for does not exist or has moved."
        />
      </AuthContainer>
    </>
  );
}
