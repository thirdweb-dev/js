import { Signer, WalletAdapter } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { z } from "zod";

/**
 * @internal
 */
export const MAX_BPS = 10000;

/**
 * @internal
 */
export const BasisPointsSchema = z
  .number()
  .max(MAX_BPS, "Cannot exceed 100%")
  .min(0, "Cannot be below 0%");

/**
 * @internal
 */
export const PercentSchema = z
  .number()
  .max(100, "Cannot exceed 100%")
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
export type JsonLiteral = number | string | null | boolean;

/**
 * @internal
 */
export type Json = JsonLiteral | JsonObject | Json[];

/**
 * @internal
 */
export type JsonObject = { [key: string]: Json };

/**
 * @internal
 */
const PropertiesInput = z.object({}).catchall(z.unknown());

/**
 * @internal
 */
export const OptionalPropertiesInput = z
  .union([z.array(PropertiesInput), PropertiesInput])
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
export const RawDateSchema = z.date().transform((i) => {
  return Math.floor(i.getTime() / 1000);
});

/**
 * @internal
 */
export type Amount = z.input<typeof AmountSchema>;

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

/**
 * @internal
 */
export const AddressSchema = z.union([
  z.string(),
  z.instanceof(PublicKey).transform((key) => key.toBase58()),
]);

const isBrowser = () => typeof window !== "undefined";
const FileOrBufferUnionSchema = isBrowser()
  ? (z.instanceof(File) as z.ZodType<InstanceType<typeof File>>)
  : (z.instanceof(Buffer) as z.ZodTypeAny); // @fixme, this is a hack to make browser happy for now

/**
 * @internal
 */
export const FileOrBufferSchema = z.union([
  FileOrBufferUnionSchema,
  z.object({
    data: z.union([FileOrBufferUnionSchema, z.string()]),
    name: z.string(),
  }),
]);

/**
 * @internal
 */
export const FileOrBufferOrStringSchema = z.union([
  FileOrBufferSchema,
  z.string(),
]);
