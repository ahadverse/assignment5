import { Loader2 } from "lucide-react";

export function PaymentRedirectFallback({ label }: { label: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Taking you back to your rentals.
        </p>
      </div>
    </div>
  );
}
