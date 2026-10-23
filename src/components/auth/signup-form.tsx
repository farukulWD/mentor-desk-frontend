"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCooldown } from "@/hooks/use-cooldown";
import { homeFor } from "@/lib/routes";
import { signupSchema, type SignupValues } from "@/lib/validations/auth";
import { useSignupMutation } from "@/store/api/authApi";

import { FormAlert } from "./form-alert";
import { handleAuthError } from "./handle-auth-error";

const FIELDS = ["name", "email", "password", "confirmPassword"] as const;

type TextField = {
  name: (typeof FIELDS)[number];
  label: string;
  type: string;
  autoComplete: string;
  placeholder?: string;
  description?: string;
};

const TEXT_FIELDS: TextField[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", placeholder: "Jane Doe" },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    description: "At least 6 characters, with a letter and a number.",
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    type: "password",
    autoComplete: "new-password",
  },
];

export function SignupForm() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const cooldown = useCooldown();
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const rootError = form.formState.errors.root?.message;

  const onSubmit = async (values: SignupValues) => {
    try {
      const { user } = await signup(values).unwrap();
      toast.success("Account created");
      router.replace(homeFor(user.role));
    } catch (error) {
      handleAuthError({
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
        <CardTitle className="text-xl">Create account</CardTitle>
        <CardDescription>Sign up as a student to submit projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {TEXT_FIELDS.map(({ name, label, description, ...inputProps }) => (
              <Controller
                key={name}
                name={name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`signup-${name}`}>{label}</FieldLabel>
                    <Input
                      {...field}
                      {...inputProps}
                      id={`signup-${name}`}
                      aria-invalid={fieldState.invalid}
                    />
                    {description && !fieldState.invalid && (
                      <FieldDescription>{description}</FieldDescription>
                    )}
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            ))}
            <FormAlert message={rootError} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button
          type="submit"
          form="signup-form"
          size="lg"
          className="w-full"
          disabled={isLoading || cooldown.isCoolingDown}
        >
          {cooldown.isCoolingDown
            ? `Try again in ${cooldown.secondsLeft}s`
            : isLoading
              ? "Creating account…"
              : "Sign up"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
