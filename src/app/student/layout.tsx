import { RoleGuard } from "@/components/auth/role-guard";

export default function StudentLayout({ children }: LayoutProps<"/student">) {
  return <RoleGuard role="STUDENT">{children}</RoleGuard>;
}
