import { RoleGuard } from "@/components/auth/role-guard";

export default function MentorLayout({ children }: LayoutProps<"/mentor">) {
  return <RoleGuard role="MENTOR">{children}</RoleGuard>;
}
