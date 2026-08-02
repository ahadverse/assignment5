import { z } from "zod";

export const gearSchema = z.object({
  name: z.string().trim().min(1, "Gear name is required"),
  brand: z.string().trim().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Pick a category"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Keep the description under 2000 characters"),
  pricePerDay: z
    .number({ invalid_type_error: "Enter a price" })
    .positive("Price per day must be greater than 0"),
  condition: z.enum(["NEW", "GOOD", "FAIR"]),
  stock: z
    .number({ invalid_type_error: "Enter a stock count" })
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative"),
  availability: z.boolean(),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "Add at least one image"),
  specifications: z.array(
    z.object({
      key: z.string().trim().min(1, "Name the specification"),
      value: z.string().trim().min(1, "Add a value"),
    })
  ),
});

export type GearValues = z.infer<typeof gearSchema>;

export function toSpecRecord(entries: GearValues["specifications"]) {
  return entries.reduce<Record<string, string>>((acc, entry) => {
    acc[entry.key] = entry.value;
    return acc;
  }, {});
}

export function toSpecEntries(record: Record<string, string> | null) {
  if (!record) return [];
  return Object.entries(record).map(([key, value]) => ({
    key,
    value: String(value),
  }));
}
