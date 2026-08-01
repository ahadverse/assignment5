export interface FieldIssue {
  path: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  fieldIssues: FieldIssue[];

  constructor(message: string, status = 500, fieldIssues: FieldIssue[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldIssues = fieldIssues;
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) {
    if (error.message === "Failed to fetch") {
      return "Cannot reach the server. Check your connection and try again.";
    }
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export function getFieldIssues(error: unknown): FieldIssue[] {
  return error instanceof ApiError ? error.fieldIssues : [];
}
