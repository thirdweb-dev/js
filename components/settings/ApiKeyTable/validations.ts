import { isAddress } from "ethers/lib/utils";
import { RE_BUNDLE_ID, RE_DOMAIN } from "utils/regex";
import { validStrList } from "utils/validations";
import { z } from "zod";

const customAuthenticationSchema = z.object({
  jwksUri: z.string(),
  aud: z.string(),
});

export const apiKeyValidationSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Must be at least 3 chars" })
    .max(64, { message: "Must be max 64 chars" }),
  domains: z.string().refine(
    (str) =>
      validStrList(str, (domain) => {
        return domain.split(":")[0] === "localhost" || RE_DOMAIN.test(domain);
      }),
    {
      message: "Some of the domains are invalid",
    },
  ),
  bundleIds: z.string().refine((str) => validStrList(str, RE_BUNDLE_ID), {
    message: "Some of the bundle ids are invalid",
  }),
  redirectUrls: z
    .string()
    .refine(
      (str) =>
        validStrList(str, (url) => url.includes("://") && !/\s/g.test(url)),
      {
        message:
          "Some of the redirect URIs are invalid. Make sure they are valid URIs and do not contain spaces.",
      },
    )
    .refine((str) => str !== "*", {
      message: "Wildcard redirect URIs are not allowed",
    }),
  services: z.optional(
    z
      .array(
        z.object({
          name: z.string(),
          enabled: z.boolean().optional(),
          targetAddresses: z
            .string()
            .refine((str) => validStrList(str, isAddress), {
              message: "Some of the addresses are invalid",
            }),
          recoveryShareManagement: z
            // This should be the same as @paperxyz/embedded-wallet-service-sdk RecoveryShareManagement enum
            // Aso needs to be kept in sync with the type in `useApi.ts`
            .enum(["AWS_MANAGED", "USER_MANAGED"])
            .optional(),
          actions: z.array(z.string()),
          customAuthentication: z.union([
            z.undefined(),
            customAuthenticationSchema,
          ]),
        }),
      )
      .optional(),
  ),
});

export type ApiKeyValidationSchema = z.infer<typeof apiKeyValidationSchema>;

// FIXME: Remove
export const HIDDEN_SERVICES = ["relayer"];
