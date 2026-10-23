import { Controller, type Control } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DESCRIPTION_MAX,
  type SubmissionValues,
} from "@/lib/validations/submission";

export const SUBMISSION_FIELDS = [
  "projectName",
  "repoUrl",
  "liveUrl",
  "description",
] as const;

type TextField = {
  name: Exclude<(typeof SUBMISSION_FIELDS)[number], "description">;
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

type SubmissionFieldsProps = {
  control: Control<SubmissionValues>;
  idPrefix: string;
};

export function SubmissionFields({ control, idPrefix }: SubmissionFieldsProps) {
  return (
    <>
      {TEXT_FIELDS.map(({ name, label, ...inputProps }) => (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${idPrefix}-${name}`}>{label}</FieldLabel>
              <Input
                {...field}
                {...inputProps}
                id={`${idPrefix}-${name}`}
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      ))}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`${idPrefix}-description`}>Description</FieldLabel>
            <Textarea
              {...field}
              id={`${idPrefix}-description`}
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
    </>
  );
}
