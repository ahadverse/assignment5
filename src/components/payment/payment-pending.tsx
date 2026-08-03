import { Loader2 } from "lucide-react";

export function PaymentPending({
  label,
  hint = "This only takes a moment. Do not close this tab.",
}: {
  label: string;
  hint?: string;
}) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <div className="text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
