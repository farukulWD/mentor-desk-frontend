"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { homeFor, LOGIN_PATH } from "@/lib/routes";
import { useGetMeQuery } from "@/store/api/authApi";

import { SessionLoading } from "./session-loading";

export function RootRedirect() {
  const router = useRouter();
  const { data: user, isError } = useGetMeQuery();

  useEffect(() => {
    if (user) router.replace(homeFor(user.role));
    else if (isError) router.replace(LOGIN_PATH);
  }, [user, isError, router]);

  return <SessionLoading />;
}
