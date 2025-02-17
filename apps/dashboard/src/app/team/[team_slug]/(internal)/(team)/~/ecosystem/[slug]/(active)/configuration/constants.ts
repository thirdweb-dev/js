import z from "zod";

const isDomainRegex =
  /^(?:\*|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*(?:\*(?:\.[a-z0-9][a-z0-9-]{0,61}[a-z0-9](?:\.[a-z0-9][a-z0-9-]{0,61}[a-z0-9])*)?)|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]|localhost(?::\d{1,5})?)$/;

export const partnerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .refine((name) => /^[a-zA-Z0-9 ]*$/.test(name), {
      message: "Name can only contain letters, numbers and spaces",
    }),
  domains: z
    .string()
    .trim()
    .transform((s) => s.split(/,| /).filter((d) => d.length > 0))
    .refine((domains) => domains.every((d) => isDomainRegex.test(d)), {
      message: "Invalid domain format", // This error message CANNOT be within the array iteration, or the FormMessage won't be able to find it in the form state
    })
    .transform((s) => s.join(",")), // This is rejoined to return a string (and later split again) since react-hook-form's typings can't handle different input vs output types
  bundleIds: z
    .string()
    .trim()
    .transform((s) =>
      s
        .split(/,| /)
        .filter((d) => d.length > 0)
        .join(","),
    ),
});
