import { cn } from "@/lib/utils";

export function PageContainer({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      className={cn("mx-auto w-full max-w-6xl flex-1 px-4 py-6", className)}
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
      className={cn(
        "grid w-full flex-1 place-items-center px-4 py-10",
        className,
      )}
      {...props}
    />
  );
}
