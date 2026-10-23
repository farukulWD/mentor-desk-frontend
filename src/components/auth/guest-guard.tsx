"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { homeFor } from "@/lib/routes";
import { useGetMeQuery } from "@/store/api/authApi";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user } = useGetMeQuery();

  useEffect(() => {
    if (user) router.replace(homeFor(user.role));
  }, [user, router]);

  return children;
}
