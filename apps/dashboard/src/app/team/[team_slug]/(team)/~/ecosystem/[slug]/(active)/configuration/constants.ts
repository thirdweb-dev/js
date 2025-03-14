import z from "zod";

const isDomainRegex =
  /^(?:\*|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*(?:\*(?:\.[a-z0-9][a-z0-9-]{0,61}[a-z0-9](?:\.[a-z0-9][a-z0-9-]{0,61}[a-z0-9])*)?)|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]|localhost(?::\d{1,5})?)$/;

export const partnerFormSchema = z
  .object({
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
    accessControlEnabled: z.boolean().default(false),
    serverVerifierEnabled: z.boolean().default(false),
    accessControl: z
      .object({
        serverVerifier: z
          .object({
            url: z.string().optional(),
            headers: z
              .array(
                z.object({
                  key: z.string(),
                  value: z.string(),
                }),
              )
              .optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // If serverVerifier is enabled, validate the URL
      if (data.accessControlEnabled && data.serverVerifierEnabled) {
        return (
          data.accessControl?.serverVerifier?.url &&
          data.accessControl.serverVerifier.url.trim() !== ""
        );
      }
      // Otherwise, no validation needed
      return true;
    },
    {
      message:
        "Server Verifier URL is required when Server Verifier is enabled",
      path: ["accessControl", "serverVerifier", "url"],
    },
  )
  .refine(
    (data) => {
      // If serverVerifier is enabled, validate the URL format
      if (
        data.accessControlEnabled &&
        data.serverVerifierEnabled &&
        data.accessControl?.serverVerifier?.url
      ) {
        try {
          new URL(data.accessControl.serverVerifier.url);
          return true;
        } catch {
          return false;
        }
      }
      // Otherwise, no validation needed
      return true;
    },
    {
      message: "Please enter a valid URL",
      path: ["accessControl", "serverVerifier", "url"],
    },
  );
