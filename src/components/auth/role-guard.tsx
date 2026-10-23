"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogout } from "@/hooks/use-logout";
import { getApiError } from "@/lib/api-error";
import { homeFor, LOGIN_PATH } from "@/lib/routes";
import { useGetMeQuery } from "@/store/api/authApi";
import type { Role } from "@/types";

import { SessionLoading } from "./session-loading";

type RoleGuardProps = {
  role: Role;
  children: React.ReactNode;
};

const UNAUTHENTICATED = [401, 403];

export function RoleGuard({ role, children }: RoleGuardProps) {
  const router = useRouter();
  const { data: user, error, isLoading, refetch } = useGetMeQuery();
  const { logout, isLoggingOut } = useLogout();
  const apiError = error ? getApiError(error) : null;
  const isUnauthenticated =
    apiError?.status != null && UNAUTHENTICATED.includes(apiError.status);

  useEffect(() => {
    if (isUnauthenticated) router.replace(LOGIN_PATH);
    else if (user && user.role !== role) router.replace(homeFor(user.role));
  }, [isUnauthenticated, user, role, router]);

  if (apiError && !isUnauthenticated) {
    return (
      <>
        <AppHeader />
        <PageContainer className="grid place-items-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Could not load your session</CardTitle>
              <CardDescription>{apiError.message}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => refetch()}>Try again</Button>
            </CardFooter>
          </Card>
        </PageContainer>
      </>
    );
  }

  if (isLoading || !user || user.role !== role) return <SessionLoading />;

  return (
    <>
      <AppHeader user={user} onLogout={logout} isLoggingOut={isLoggingOut} />
      {children}
    </>
  );
}
