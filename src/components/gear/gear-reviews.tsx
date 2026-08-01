import { MessageSquareText } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RatingStars } from "@/components/shared/rating-stars";
import { formatDate, initials } from "@/lib/format";
import type { Review } from "@/types";

export function GearReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-12 text-center">
        <MessageSquareText className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 font-medium">No reviews yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Be the first to review this gear after your rental.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-xl border bg-card p-5">
          <div className="flex items-start gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">
                {initials(review.customer?.fullName ?? "GearUp User")}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-medium">
                  {review.customer?.fullName ?? "GearUp User"}
                </p>
                <RatingStars rating={review.rating} size="size-3.5" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {review.reviewText}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
