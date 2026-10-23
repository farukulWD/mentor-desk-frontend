"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormAlert } from "@/components/form/form-alert";
import {
  SUBMISSION_FIELDS,
  SubmissionFields,
} from "@/components/submission/submission-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useCooldown } from "@/hooks/use-cooldown";
import { handleFormError } from "@/lib/handle-form-error";
import {
  submissionSchema,
  type SubmissionValues,
} from "@/lib/validations/submission";
import { useCreateSubmissionMutation } from "@/store/api/submissionApi";

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
        fields: SUBMISSION_FIELDS,
        startCooldown: cooldown.start,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          <h2>Submit a project</h2>
        </CardTitle>
        <CardDescription>
          A mentor will review it and leave feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="submission-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <SubmissionFields control={form.control} idPrefix="submission" />
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
