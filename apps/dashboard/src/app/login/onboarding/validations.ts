import { z } from "zod";

const nameValidation = z
  .string()
  .min(3, { message: "Must be at least 3 chars" })
  .max(64, { message: "Must be max 64 chars" });

export const emailSchema = z.string().email("Invalid email address");

export const accountValidationSchema = z.object({
  email: emailSchema,
  name: nameValidation.or(z.literal("")),
});

export const emailConfirmationValidationSchema = z.object({
  confirmationToken: z.string().length(6),
});

export type AccountValidationSchema = z.infer<typeof accountValidationSchema>;

export type EmailConfirmationValidationSchema = z.infer<
  typeof emailConfirmationValidationSchema
>;
