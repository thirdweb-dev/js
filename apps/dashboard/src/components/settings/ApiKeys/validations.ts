import { isAddress } from "thirdweb/utils";
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
      return domain.startsWith("localhost:") || RE_DOMAIN.test(domain);
    }),
  {
    message: "Some of the domains are invalid",
  },
);

const customAuthValidation = z.union([
  z.undefined(),
  z.object({
    jwksUri: z.string(),
    aud: z.string(),
  }),
]);

const customAuthEndpointValidation = z.union([
  z.undefined(),
  z.object({
    authEndpoint: z.string().url(),
    customHeaders: z.array(z.object({ key: z.string(), value: z.string() })),
  }),
]);

const recoverManagementValidation = z
  // This should be the same as @thirdweb-dev/wallets RecoveryShareManagement enum
  // Aso needs to be kept in sync with the type in `useApi.ts`
  .enum(["AWS_MANAGED", "USER_MANAGED"])
  .optional();

const applicationNameValidation = z.union([z.undefined(), z.string()]);

const applicationImageUrlValidation = z.union([
  z.undefined(),
  z.string().refine(
    (str) => {
      if (!str) {
        return true;
      }

      try {
        new URL(str);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Please, enter a valid image url.",
    },
  ),
]);

const payoutAddressValidation = z
  .string()
  .regex(/(\b0x[a-fA-F0-9]{40}\b)/, "Please enter a valid address");

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
        recoveryShareManagement: recoverManagementValidation,
        customAuthentication: customAuthValidation,
        customAuthEndpoint: customAuthEndpointValidation,
        applicationName: applicationNameValidation,
        applicationImageUrl: applicationImageUrlValidation,
      }),
    )
    .optional(),
);

export const apiKeyCreateValidationSchema = z.object({
  name: nameValidation,
  domains: domainsValidation,
  services: servicesValidation,
});

function isValidRedirectURI(uri: string) {
  // whitespace is not allowed
  if (/\s/g.test(uri)) {
    return false;
  }

  // foo://... is allowed
  if (uri.includes("://")) {
    return true;
  }

  // localhost:... is allowed
  if (uri.startsWith("localhost:")) {
    return true;
  }

  // valid url is allowed
  try {
    new URL(uri);
    return true;
  } catch {
    // invalid
  }

  // everything else is invalid
  return false;
}

const redirectUriSchema = z
  .string()
  .refine((str) => validStrList(str, isValidRedirectURI), {
    message:
      "Some of the redirect URIs are invalid. Make sure they are valid URIs and do not contain spaces.",
  })
  .refine((str) => str !== "*", {
    message: "Wildcard redirect URIs are not allowed",
  });

// TODO: move this schema to project settings folder in separate PR
export const projectSettingsPageFormSchema = z.object({
  name: nameValidation,
  domains: domainsValidation,
  services: servicesValidation,
  bundleIds: z.string().refine((str) => validStrList(str, RE_BUNDLE_ID), {
    message: "Some of the bundle ids are invalid",
  }),
  // no strict validation for redirectUrls, because project general page does not render redirectUrls form field
  // so if the user has already saved an invalid `redirectUrls` on in-app wallet project settings page ( which is fixed now ) - it won't prevent them from updating the general project settings
  redirectUrls: z.string(),
});

export const apiKeyEmbeddedWalletsValidationSchema = z.object({
  customAuthentication: customAuthValidation,
  customAuthEndpoint: customAuthEndpointValidation,
  branding: z.union([
    z.undefined(),
    z.object({
      applicationName: applicationNameValidation,
      applicationImageUrl: applicationImageUrlValidation,
    }),
  ]),
  redirectUrls: redirectUriSchema,
});

export const apiKeyPayConfigValidationSchema = z.object({
  payoutAddress: payoutAddressValidation,
});

export type ApiKeyCreateValidationSchema = z.infer<
  typeof apiKeyCreateValidationSchema
>;

export type ProjectSettingsPageFormSchema = z.infer<
  typeof projectSettingsPageFormSchema
>;

export type ApiKeyEmbeddedWalletsValidationSchema = z.infer<
  typeof apiKeyEmbeddedWalletsValidationSchema
>;

export type ApiKeyPayConfigValidationSchema = z.infer<
  typeof apiKeyPayConfigValidationSchema
>;

// FIXME: Remove
export const HIDDEN_SERVICES = ["relayer", "chainsaw"];
