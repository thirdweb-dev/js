import { NATIVE_TOKEN_ADDRESS, toHex, ZERO_ADDRESS } from "thirdweb";
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
    currencyAddress: z.string().default(ZERO_ADDRESS).optional(), // defaults to 0
    maxClaimable: QuantitySchema.default(0), // defaults to unlimited, but can be undefined in old snapshots
    price: QuantitySchema.optional(), // defaults to AddressZero, but can be undefined for old snapshots
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
    currencyAddress: z.string().default(NATIVE_TOKEN_ADDRESS),
    maxClaimablePerWallet: QuantitySchema,
    maxClaimableSupply: QuantitySchema,
    merkleRootHash: z.string().default(toHex("", { size: 32 })),
    metadata: ClaimConditionMetadataSchema.optional(),
    price: AmountSchema.default(0),
    snapshot: z.optional(SnapshotInputSchema).nullable(),
    startTime: StartDateSchema,
    waitInSeconds: BigNumberishSchema.default(0),
  }))();

const PartialClaimConditionInputSchema = /* @__PURE__ */ (() =>
  ClaimConditionInputSchema.partial())();

/**
 * @internal
 */
const CurrencySchema = /* @__PURE__ */ (() =>
  z.object({
    decimals: z.number(),
    name: z.string(),
    symbol: z.string(),
  }))();

/**
 * @internal
 */
const CurrencyValueSchema = /* @__PURE__ */ (() =>
  CurrencySchema.extend({
    displayValue: z.string(),
    value: BigNumberSchema,
  }))();

const ClaimConditionOutputSchema = /* @__PURE__ */ (() =>
  ClaimConditionInputSchema.extend({
    availableSupply: QuantitySchema,
    currencyMetadata: CurrencyValueSchema.default({
      decimals: 18,
      displayValue: "0",
      name: "",
      symbol: "",
      value: 0n,
    }),
    currentMintSupply: QuantitySchema,
    price: BigNumberSchema,
    snapshot: SnapshotInputSchema.optional().nullable(),
    startTime: BigNumberSchema.transform((n) => new Date(Number(n) * 1000)),
    waitInSeconds: BigNumberSchema,
  }))();

export type SnapshotEntry = z.output<typeof SnapshotEntryInput>;

export type ClaimConditionInput = z.input<
  typeof PartialClaimConditionInputSchema
>;

export type ClaimCondition = z.output<typeof ClaimConditionOutputSchema>;
