"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormAlert } from "@/components/form/form-alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCooldown } from "@/hooks/use-cooldown";
import { handleFormError } from "@/lib/handle-form-error";
import { homeFor } from "@/lib/routes";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { useLoginMutation } from "@/store/api/authApi";

const FIELDS = ["email", "password"] as const;

export function LoginForm() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const cooldown = useCooldown();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });
  const rootError = form.formState.errors.root?.message;

  const onSubmit = async (values: LoginValues) => {
    try {
      const { user } = await login(values).unwrap();
      toast.success(`Welcome back, ${user.name}`);
      router.replace(homeFor(user.role));
    } catch (error) {
      handleFormError({
        error,
        setError: form.setError,
        fields: FIELDS,
        startCooldown: cooldown.start,
      });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">
          <h1>Log in</h1>
        </CardTitle>
        <CardDescription>Welcome back to MentorDesk.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? "login-email-error" : undefined
                    }
                  />
                  <FieldError
                    id="login-email-error"
                    errors={[fieldState.error]}
                  />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? "login-password-error" : undefined
                    }
                  />
                  <FieldError
                    id="login-password-error"
                    errors={[fieldState.error]}
                  />
                </Field>
              )}
            />
            <FormAlert message={rootError} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button
          type="submit"
          form="login-form"
          size="lg"
          className="w-full"
          disabled={isLoading || cooldown.isCoolingDown}
        >
          {cooldown.isCoolingDown
            ? `Try again in ${cooldown.secondsLeft}s`
            : isLoading
              ? "Signing in…"
              : "Log in"}
        </Button>
        <p className="text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
            Sign up as a student
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          Mentors: use the account provided by your admin.
        </p>
      </CardFooter>
    </Card>
  );
}
