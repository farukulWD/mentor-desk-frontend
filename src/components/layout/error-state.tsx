"use client";

import { IconAlertTriangle } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ErrorStateProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  error?: unknown;
  onRetry?: () => void;
};

const getDigest = (error: unknown) =>
  error instanceof Error && "digest" in error && typeof error.digest === "string"
    ? error.digest
    : undefined;

export function ErrorState({
  title,
  description,
  icon = <IconAlertTriangle />,
  error,
  onRetry,
}: ErrorStateProps) {
  const digest = getDigest(error);

  useEffect(() => {
    if (error !== undefined) console.error(error);
  }, [error]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div
          aria-hidden
          className="mb-2 text-muted-foreground [&_svg]:size-8"
        >
          {icon}
        </div>
        <CardTitle className="text-xl">
          <h1>{title}</h1>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        {digest && (
          <p className="font-mono text-xs text-muted-foreground">
            Error ID: {digest}
          </p>
        )}
      </CardHeader>
      <CardFooter className="gap-2">
        {onRetry && <Button onClick={onRetry}>Try again</Button>}
        <Button
          variant={onRetry ? "outline" : "default"}
          nativeButton={false}
          render={<Link href="/" />}
        >
          Go home
        </Button>
      </CardFooter>
    </Card>
  );
}
