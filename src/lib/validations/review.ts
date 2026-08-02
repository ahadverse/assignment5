import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number({ required_error: "Pick a rating" })
    .int()
    .min(1, "Pick a rating between 1 and 5")
    .max(5, "Pick a rating between 1 and 5"),
  reviewText: z
    .string()
    .trim()
    .min(1, "Write a few words about this rental")
    .max(1000, "Keep your review under 1000 characters"),
});

export type ReviewValues = z.infer<typeof reviewSchema>;
