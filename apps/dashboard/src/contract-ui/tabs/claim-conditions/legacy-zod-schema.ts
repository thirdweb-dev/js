import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS, toHex } from "thirdweb";
import { z } from "zod";

const RawDateSchema = /* @__PURE__ */ (() =>
  z.date().transform((i) => {
    return Math.floor(i.getTime() / 1000);
  }))();

const StartDateSchema = /* @__PURE__ */ (() =>
  RawDateSchema.default(new Date(0)))();

const AmountSchema = /* @__PURE__ */ (() =>
  z
    .union([
      z.string().regex(/^([0-9]+\.?[0-9]*|\.[0-9]+)$/, "Invalid amount"),
      z.number().min(0, "Amount cannot be negative"),
    ])
    .transform((arg) => (typeof arg === "number" ? arg.toString() : arg)))();

const QuantitySchema = /* @__PURE__ */ (() =>
  z.union([AmountSchema, z.literal("unlimited")]).default("unlimited"))();

const ClaimConditionMetadataSchema = /* @__PURE__ */ (() =>
  z
    .object({
      name: z.string().optional(),
    })
    .catchall(z.unknown()))();

const BigNumberSchema = /* @__PURE__ */ (() =>
  z.union([z.string(), z.number(), z.bigint()]).transform((arg) => {
    return BigInt(arg);
  }))();

const BigNumberishSchema = /* @__PURE__ */ (() =>
  BigNumberSchema.transform((arg) => arg.toString()))();

const SnapshotEntryInput = /* @__PURE__ */ (() =>
  z.object({
    address: z.string(),
    maxClaimable: QuantitySchema.default(0), // defaults to 0
    price: QuantitySchema.optional(), // defaults to unlimited, but can be undefined in old snapshots
    currencyAddress: z.string().default(ZERO_ADDRESS).optional(), // defaults to AddressZero, but can be undefined for old snapshots
  }))();

const SnapshotInputSchema = /* @__PURE__ */ (() =>
  z.union([
    z.array(z.string()).transform(
      async (strings) =>
        await Promise.all(
          strings.map((address) =>
            SnapshotEntryInput.parseAsync({
              address,
            }),
          ),
        ),
    ),
    z.array(SnapshotEntryInput),
  ]))();

export const ClaimConditionInputSchema = /* @__PURE__ */ (() =>
  z.object({
    startTime: StartDateSchema,
    currencyAddress: z.string().default(NATIVE_TOKEN_ADDRESS),
    price: AmountSchema.default(0),
    maxClaimableSupply: QuantitySchema,
    maxClaimablePerWallet: QuantitySchema,
    waitInSeconds: BigNumberishSchema.default(0),
    merkleRootHash: z.string().default(toHex("", { size: 32 })),
    snapshot: z.optional(SnapshotInputSchema).nullable(),
    metadata: ClaimConditionMetadataSchema.optional(),
  }))();

const PartialClaimConditionInputSchema = /* @__PURE__ */ (() =>
  ClaimConditionInputSchema.partial())();

/**
 * @internal
 */
const CurrencySchema = /* @__PURE__ */ (() =>
  z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }))();

/**
 * @internal
 */
const CurrencyValueSchema = /* @__PURE__ */ (() =>
  CurrencySchema.extend({
    value: BigNumberSchema,
    displayValue: z.string(),
  }))();

const ClaimConditionOutputSchema = /* @__PURE__ */ (() =>
  ClaimConditionInputSchema.extend({
    availableSupply: QuantitySchema,
    currentMintSupply: QuantitySchema,
    currencyMetadata: CurrencyValueSchema.default({
      value: 0n,
      displayValue: "0",
      symbol: "",
      decimals: 18,
      name: "",
    }),
    price: BigNumberSchema,
    waitInSeconds: BigNumberSchema,
    startTime: BigNumberSchema.transform((n) => new Date(Number(n) * 1000)),
    snapshot: SnapshotInputSchema.optional().nullable(),
  }))();

export type SnapshotEntry = z.output<typeof SnapshotEntryInput>;

export type ClaimConditionInput = z.input<
  typeof PartialClaimConditionInputSchema
>;

export type ClaimCondition = z.output<typeof ClaimConditionOutputSchema>;
