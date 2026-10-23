import type { Role } from "@/types";

export const LOGIN_PATH = "/login";

export const PROTECTED_PREFIXES = ["/student", "/mentor"];

export const homeFor = (role: Role) =>
  role === "MENTOR" ? "/mentor" : "/student";
