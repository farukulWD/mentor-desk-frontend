"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCooldown } from "@/hooks/use-cooldown";
import { handleFormError } from "@/lib/handle-form-error";
import {
  DESCRIPTION_MAX,
  submissionSchema,
  type SubmissionValues,
} from "@/lib/validations/submission";
import { useCreateSubmissionMutation } from "@/store/api/submissionApi";

const FIELDS = ["projectName", "repoUrl", "liveUrl", "description"] as const;

type TextField = {
  name: Exclude<(typeof FIELDS)[number], "description">;
  label: string;
  type: string;
  placeholder: string;
};

const TEXT_FIELDS: TextField[] = [
  { name: "projectName", label: "Project name", type: "text", placeholder: "My awesome app" },
  {
    name: "repoUrl",
    label: "GitHub repository",
    type: "url",
    placeholder: "https://github.com/owner/repo",
  },
  { name: "liveUrl", label: "Live URL", type: "url", placeholder: "https://example.com" },
];

const DEFAULT_VALUES: SubmissionValues = {
  projectName: "",
  repoUrl: "",
  liveUrl: "",
  description: "",
};

export function SubmissionForm() {
  const [createSubmission, { isLoading }] = useCreateSubmissionMutation();
  const cooldown = useCooldown();
  const form = useForm<SubmissionValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onTouched",
    defaultValues: DEFAULT_VALUES,
  });
  const rootError = form.formState.errors.root?.message;

  const onSubmit = async (values: SubmissionValues) => {
    try {
      await createSubmission(values).unwrap();
      form.reset(DEFAULT_VALUES);
      toast.success("Project submitted");
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Submit a project</CardTitle>
        <CardDescription>A mentor will review it and leave feedback.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="submission-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {TEXT_FIELDS.map(({ name, label, ...inputProps }) => (
              <Controller
                key={name}
                name={name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`submission-${name}`}>{label}</FieldLabel>
                    <Input
                      {...field}
                      {...inputProps}
                      id={`submission-${name}`}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            ))}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="submission-description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="submission-description"
                    rows={5}
                    maxLength={DESCRIPTION_MAX}
                    placeholder="What does it do, and what should the mentor look at?"
                    aria-invalid={fieldState.invalid}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <FieldError errors={[fieldState.error]} />
                    <FieldDescription className="ml-auto shrink-0 tabular-nums">
                      {field.value.length} / {DESCRIPTION_MAX}
                    </FieldDescription>
                  </div>
                </Field>
              )}
            />
            <FormAlert message={rootError} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="submission-form"
          size="lg"
          className="w-full"
          disabled={isLoading || cooldown.isCoolingDown}
        >
          {cooldown.isCoolingDown
            ? `Try again in ${cooldown.secondsLeft}s`
            : isLoading
              ? "Submitting…"
              : "Submit project"}
        </Button>
      </CardFooter>
    </Card>
  );
}
