import { z } from "zod";

export const isoSignupSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  company: z.string().trim().min(2, "Please enter your company name."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email."),
  website: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || v.startsWith("http://") || v.startsWith("https://"),
      "Website must start with http:// or https://",
    ),
  monthlyVolume: z
    .string()
    .trim()
    .optional(),
  message: z
    .string()
    .trim()
    .max(1000, "Please keep the message under 1000 characters.")
    .optional(),
});

export type IsoSignupValues = z.infer<typeof isoSignupSchema>;

