import { Signer, WalletAdapter } from "@metaplex-foundation/js";
import { JsonObjectSchema } from "@thirdweb-dev/storage";
import { z } from "zod";

/**
 * @internal
 */
export const MAX_BPS = 10_000;

/**
 * @internal
 */
export const BasisPointsSchema = z
  .number()
  .max(MAX_BPS, "Cannot exeed 100%")
  .min(0, "Cannot be below 0%");

/**
 * @internal
 */
export const PercentSchema = z
  .number()
  .max(100, "Cannot exeed 100%")
  .min(0, "Cannot be below 0%");

/**
 * @internal
 */
export const JsonLiteral = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

/**
 * @internal
 */
export const HexColor = z.union([
  z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color")
    .transform((val) => val.replace("#", "")),
  z.string().length(0),
]);

/**
 * @internal
 */
export const OptionalPropertiesInput = z
  .union([z.array(JsonObjectSchema), JsonObjectSchema])
  .optional();

/**
 * @internal
 */
export const AmountSchema = z
  .union([
    z.string().regex(/^([0-9]+\.?[0-9]*|\.[0-9]+)$/, "Invalid amount"),
    z.number().min(0, "Amount cannot be negative"),
  ])
  .transform((arg) => (typeof arg === "number" ? arg.toString() : arg));

/**
 * @internal
 */
export type Amount = z.input<typeof AmountSchema>;

/**
 * @internal
 */
export const CurrencyValueSchema = z.object({
  value: z.string(),
  displayValue: z.string(),
});

/**
 * @internal
 */
export type CurrencyValue = z.input<typeof CurrencyValueSchema>;

/**
 * @internal
 */
export type TransactionResult = {
  signature: string;
};

/**
 * @internal
 */
export type WalletSigner = Signer | WalletAdapter;

/**
 * @internal
 */
export type AccountType = "nft-collection" | "nft-drop" | "token";

/**
 * @internal
 */
export type WalletAccount = {
  type: AccountType;
  address: string;
  name: string;
};
