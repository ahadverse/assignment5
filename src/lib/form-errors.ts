import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { getErrorMessage, getFieldIssues } from "@/lib/api-error";

export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  knownFields: readonly string[]
) {
  const issues = getFieldIssues(error);
  let matched = false;

  issues.forEach((issue) => {
    const field = issue.path.split(".").pop() ?? issue.path;
    if (knownFields.includes(field)) {
      matched = true;
      setError(field as Path<T>, { type: "server", message: issue.message });
    }
  });

  return { matched, message: getErrorMessage(error) };
}
