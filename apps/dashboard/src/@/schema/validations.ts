import { isAddress } from "thirdweb";
import { z } from "zod";
import { RE_DOMAIN } from "@/utils/regex";
import { validStrList } from "@/utils/validations";

export const projectNameSchema = z
  .string()
  .min(3, { message: "Must be at least 3 chars" })
  .max(64, { message: "Must be max 64 chars" });

export const projectDomainsSchema = z.string().refine(
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
    aud: z.string(),
    jwksUri: z.string(),
  }),
]);

const customAuthEndpointValidation = z.union([
  z.undefined(),
  z.object({
    authEndpoint: z.string().url(),
    customHeaders: z.array(z.object({ key: z.string(), value: z.string() })),
  }),
]);

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

export const apiKeyEmbeddedWalletsValidationSchema = z.object({
  branding: z.union([
    z.undefined(),
    z.object({
      applicationImageUrl: applicationImageUrlValidation,
      applicationName: applicationNameValidation,
    }),
  ]),
  customAuthEndpoint: customAuthEndpointValidation,
  customAuthentication: customAuthValidation,
  redirectUrls: redirectUriSchema,
  smsEnabledCountryISOs: z.array(z.string()),
});

export const apiKeyPayConfigValidationSchema = z.object({
  developerFeeBPS: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 100, {
      message: "Developer fee must be between 0 and 100",
    })
    .optional(),
  payoutAddress: payoutAddressValidation,
});

export const routeDiscoveryValidationSchema = z.object({
  chainId: z.number(),
  tokenAddress: z
    .string({
      required_error: "Token address is required",
    })
    .refine((value) => isAddress(value), {
      message: "Invalid Ethereum address format",
    }),
});
export type RouteDiscoveryValidationSchema = z.infer<
  typeof routeDiscoveryValidationSchema
>;

export type ApiKeyEmbeddedWalletsValidationSchema = z.infer<
  typeof apiKeyEmbeddedWalletsValidationSchema
>;

export type ApiKeyPayConfigValidationSchema = z.infer<
  typeof apiKeyPayConfigValidationSchema
>;

// FIXME: Remove
export const HIDDEN_SERVICES = ["relayer", "chainsaw"];
