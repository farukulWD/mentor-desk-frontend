import { GuestGuard } from "@/components/auth/guest-guard";
import { AppHeader } from "@/components/layout/app-header";
import { AuthContainer } from "@/components/layout/page-container";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <GuestGuard>
      <AppHeader />
      <AuthContainer>{children}</AuthContainer>
    </GuestGuard>
  );
}
