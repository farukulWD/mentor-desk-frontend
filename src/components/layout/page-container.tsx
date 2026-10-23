import { cn } from "@/lib/utils";

export function PageContainer({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className={cn("mx-auto w-full max-w-6xl flex-1 px-4 py-6 outline-none", className)}
      {...props}
    />
  );
}

export function AuthContainer({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className={cn(
        "grid w-full flex-1 place-items-center px-4 py-10 outline-none",
        className,
      )}
      {...props}
    />
  );
}
