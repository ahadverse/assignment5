import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  address: z.string().trim().optional(),
  profilePicture: z
    .string()
    .trim()
    .url("Enter a valid image URL")
    .optional()
    .or(z.literal("")),
});

export type ProfileValues = z.infer<typeof profileSchema>;
