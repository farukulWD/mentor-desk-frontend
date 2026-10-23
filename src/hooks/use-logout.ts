"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LOGIN_PATH } from "@/lib/routes";
import { useLogoutMutation } from "@/store/api/authApi";

export function useLogout() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out");
    } catch {
    } finally {
      router.replace(LOGIN_PATH);
    }
  };

  return { logout: handleLogout, isLoggingOut: isLoading };
}
