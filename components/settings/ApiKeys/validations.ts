import { isAddress } from "ethers/lib/utils";
import { RE_BUNDLE_ID, RE_DOMAIN } from "utils/regex";
import { validStrList } from "utils/validations";
import { z } from "zod";

const nameValidation = z
  .string()
  .min(3, { message: "Must be at least 3 chars" })
  .max(64, { message: "Must be max 64 chars" });

const domainsValidation = z.string().refine(
  (str) =>
    validStrList(str, (domain) => {
      return domain.split(":")[0] === "localhost" || RE_DOMAIN.test(domain);
    }),
  {
    message: "Some of the domains are invalid",
  },
);

const servicesValidation = z.optional(
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
        actions: z.array(z.string()),
        recoveryShareManagement: z
          // This should be the same as @paperxyz/embedded-wallet-service-sdk RecoveryShareManagement enum
          // Aso needs to be kept in sync with the type in `useApi.ts`
          .enum(["AWS_MANAGED", "USER_MANAGED"])
          .optional(),
        customAuthentication: z.union([
          z.undefined(),
          z.object({
            jwksUri: z.string(),
            aud: z.string(),
          }),
        ]),
      }),
    )
    .optional(),
);

export const apiKeyCreateValidationSchema = z.object({
  name: nameValidation,
  domains: domainsValidation,
  services: servicesValidation,
});

export const apiKeyValidationSchema = z.object({
  name: nameValidation,
  domains: domainsValidation,
  services: servicesValidation,
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
});

export type ApiKeyCreateValidationSchema = z.infer<
  typeof apiKeyCreateValidationSchema
>;

export type ApiKeyValidationSchema = z.infer<typeof apiKeyValidationSchema>;

// FIXME: Remove
export const HIDDEN_SERVICES = ["relayer"];
