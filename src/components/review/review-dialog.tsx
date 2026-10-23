"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { SerializedError } from "@reduxjs/toolkit";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormAlert } from "@/components/form/form-alert";
import { StatusBadge } from "@/components/submission/status-badge";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useCooldown } from "@/hooks/use-cooldown";
import { getApiError } from "@/lib/api-error";
import { handleFormError } from "@/lib/handle-form-error";
import {
  FEEDBACK_MAX,
  reviewSchema,
  type ReviewDecision,
  type ReviewValues,
} from "@/lib/validations/review";
import { useReviewSubmissionMutation } from "@/store/api/submissionApi";
import type { ReviewSubmission } from "@/types";
import type { ApiError } from "@/types/api";

const REVIEW_FIELDS = ["feedback"] as const;

const DECISION_COPY = {
  APPROVED: {
    action: "Approve",
    pending: "Approving…",
    title: "Approve submission",
    success: "Submission approved",
    icon: IconCheck,
    variant: "outline",
  },
  REJECTED: {
    action: "Reject",
    pending: "Rejecting…",
    title: "Reject submission",
    success: "Submission rejected",
    icon: IconX,
    variant: "destructive",
  },
} as const;

type ReviewDialogProps = {
  submission: ReviewSubmission;
  decision: ReviewDecision;
};

type ReviewFormProps = ReviewDialogProps & {
  formId: string;
  onReviewed: () => void;
  onPendingChange: (pending: boolean) => void;
};

function ReviewForm({
  submission,
  decision,
  formId,
  onReviewed,
  onPendingChange,
}: ReviewFormProps) {
  const copy = DECISION_COPY[decision];
  const [reviewSubmission, { isLoading }] = useReviewSubmissionMutation();
  const cooldown = useCooldown();
  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    mode: "onTouched",
    defaultValues: {
      status: decision,
      feedback:
        submission.status === decision ? (submission.feedback ?? "") : "",
    },
  });
  const rootError = form.formState.errors.root?.message;
  const feedbackId = `${formId}-feedback`;
  const isRequired = decision === "REJECTED";

  const onSubmit = async (values: ReviewValues) => {
    onPendingChange(true);
    try {
      await reviewSubmission({ id: submission.id, ...values }).unwrap();
      toast.success(copy.success);
      onReviewed();
    } catch (error) {
      const { status, message } = getApiError(
        error as ApiError | SerializedError,
      );
      if (status === 404) {
        toast.error(message);
        onReviewed();
        return;
      }
      handleFormError({
        error,
        setError: form.setError,
        fields: REVIEW_FIELDS,
        startCooldown: cooldown.start,
      });
    } finally {
      onPendingChange(false);
    }
  };

  return (
    <>
      <form id={formId} noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="feedback"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={feedbackId}>
                  {isRequired ? "Feedback" : "Feedback (optional)"}
                </FieldLabel>
                <Textarea
                  {...field}
                  id={feedbackId}
                  rows={5}
                  maxLength={FEEDBACK_MAX}
                  required={isRequired}
                  autoFocus
                  placeholder={
                    isRequired
                      ? "Explain what needs to change before this can be approved."
                      : "Anything the student should know?"
                  }
                  aria-invalid={fieldState.invalid}
                />
                <div className="flex items-start justify-between gap-2">
                  <FieldError errors={[fieldState.error]} />
                  <FieldDescription className="ml-auto shrink-0 tabular-nums">
                    {field.value.length} / {FEEDBACK_MAX}
                  </FieldDescription>
                </div>
              </Field>
            )}
          />
          <FormAlert message={rootError} />
        </FieldGroup>
      </form>
      <DialogFooter>
        <DialogClose
          render={<Button variant="outline" />}
          disabled={isLoading}
        >
          Cancel
        </DialogClose>
        <Button
          type="submit"
          form={formId}
          variant={decision === "REJECTED" ? "destructive" : "default"}
          disabled={isLoading || cooldown.isCoolingDown}
        >
          {cooldown.isCoolingDown
            ? `Try again in ${cooldown.secondsLeft}s`
            : isLoading
              ? copy.pending
              : copy.action}
        </Button>
      </DialogFooter>
    </>
  );
}

export function ReviewDialog({ submission, decision }: ReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const copy = DECISION_COPY[decision];
  const DecisionIcon = copy.icon;
  const isChange =
    submission.status !== "PENDING" && submission.status !== decision;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPending) return;
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button variant={copy.variant} size="sm" />}
        aria-label={`${copy.action} ${submission.projectName}`}
      >
        <DecisionIcon data-icon="inline-start" />
        <span className="sr-only sm:not-sr-only">{copy.action}</span>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription className="wrap-break-word">
            {submission.projectName} by {submission.student.name}
          </DialogDescription>
        </DialogHeader>
        {submission.status !== "PENDING" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{isChange ? "Changing from" : "Currently"}</span>
            <StatusBadge status={submission.status} />
          </div>
        )}
        <ReviewForm
          submission={submission}
          decision={decision}
          formId={`review-form-${decision.toLowerCase()}-${submission.id}`}
          onReviewed={() => setOpen(false)}
          onPendingChange={setIsPending}
        />
      </DialogContent>
    </Dialog>
  );
}
