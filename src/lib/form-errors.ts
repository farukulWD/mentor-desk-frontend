import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export const applyServerErrors = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: Record<string, string> | undefined,
  fields: readonly Path<T>[],
) => {
  if (!errors) return false;

  let applied = false;
  for (const [key, message] of Object.entries(errors)) {
    const field = fields.find((name) => name === key);
    if (!field) continue;
    setError(field, { type: "server", message }, { shouldFocus: !applied });
    applied = true;
  }

  return applied;
};
