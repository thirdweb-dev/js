import { RE_EMAIL } from "utils/regex";
import { z } from "zod";

const nameValidation = z
  .string()
  .min(3, { message: "Must be at least 3 chars" })
  .max(64, { message: "Must be max 64 chars" });

const emailValidation = z.string().refine((str) => RE_EMAIL.test(str), {
  message: "Email address is not valid",
});

export const accountValidationSchema = z.object({
  name: nameValidation,
  email: emailValidation,
});

export const accountValidationOptionalSchema = z.object({
  email: emailValidation,
  name: nameValidation.or(z.literal("")),
});

export const emailConfirmationValidationSchema = z.object({
  confirmationToken: z.string().length(6),
});

export type AccountValidationSchema = z.infer<typeof accountValidationSchema>;

export type AccountValidationOptionalSchema = z.infer<
  typeof accountValidationOptionalSchema
>;

export type EmailConfirmationValidationSchema = z.infer<
  typeof emailConfirmationValidationSchema
>;
