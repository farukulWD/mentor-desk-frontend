"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormAlert } from "@/components/form/form-alert";
import {
  SUBMISSION_FIELDS,
  SubmissionFields,
} from "@/components/submission/submission-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useCooldown } from "@/hooks/use-cooldown";
import { handleFormError } from "@/lib/handle-form-error";
import {
  submissionSchema,
  type SubmissionValues,
} from "@/lib/validations/submission";
import { useResubmitSubmissionMutation } from "@/store/api/submissionApi";
import type { Submission } from "@/types";

const toFormValues = (submission: Submission): SubmissionValues => ({
  projectName: submission.projectName,
  repoUrl: submission.repoUrl,
  liveUrl: submission.liveUrl,
  description: submission.description,
});

export function ResubmitDialog({ submission }: { submission: Submission }) {
  const [open, setOpen] = useState(false);
  const [resubmitSubmission, { isLoading }] = useResubmitSubmissionMutation();
  const cooldown = useCooldown();
  const form = useForm<SubmissionValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onTouched",
    defaultValues: toFormValues(submission),
  });
  const rootError = form.formState.errors.root?.message;
  const formId = `resubmit-form-${submission.id}`;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) form.reset(toFormValues(submission));
    setOpen(nextOpen);
  };

  const onSubmit = async (values: SubmissionValues) => {
    try {
      await resubmitSubmission({ id: submission.id, ...values }).unwrap();
      toast.success("Resubmitted for review");
      setOpen(false);
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <IconRefresh data-icon="inline-start" />
        Edit & resubmit
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit & resubmit</DialogTitle>
          <DialogDescription>
            Address the mentor&apos;s feedback, then send it back for review.
          </DialogDescription>
        </DialogHeader>
        {submission.feedback && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm">
            <p className="text-xs font-medium text-destructive">Mentor feedback</p>
            <p className="mt-1 whitespace-pre-line text-foreground">{submission.feedback}</p>
          </div>
        )}
        <form id={formId} noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <SubmissionFields
              control={form.control}
              idPrefix={`resubmit-${submission.id}`}
            />
            <FormAlert message={rootError} />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            type="submit"
            form={formId}
            disabled={isLoading || cooldown.isCoolingDown}
          >
            {cooldown.isCoolingDown
              ? `Try again in ${cooldown.secondsLeft}s`
              : isLoading
                ? "Resubmitting…"
                : "Resubmit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
