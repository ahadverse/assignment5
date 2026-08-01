import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  paymentStatusStyles,
  rentalStatusLabels,
  rentalStatusStyles,
} from "@/lib/status";
import type { PaymentStatus, RentalStatus } from "@/types";

export function StatusBadge({
  status,
  className,
}: {
  status: RentalStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", rentalStatusStyles[status], className)}
    >
      {rentalStatusLabels[status]}
    </Badge>
  );
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", paymentStatusStyles[status], className)}
    >
      {label}
    </Badge>
  );
}
