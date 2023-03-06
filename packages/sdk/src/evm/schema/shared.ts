import { EnsSchema } from "./ens";
import { BigNumber, CallOverrides, utils } from "ethers";
import { z } from "zod";

export const BigNumberSchema = z
  .union([
    z.string(),
    z.number(),
    z.bigint(),
    z.custom<BigNumber>((data) => {
      return BigNumber.isBigNumber(data);
    }),
  ])
  .transform((arg) => BigNumber.from(arg));

export const BigNumberishSchema = BigNumberSchema.transform((arg) =>
  arg.toString(),
);

export const BigNumberTransformSchema = z
  .union([
    z.bigint(),
    z.custom<BigNumber>((data) => {
      return BigNumber.isBigNumber(data);
    }),
  ])
  .transform((arg) => {
    return BigNumber.from(arg).toString();
  });

export const AddressSchema = z.custom<Address>(
  (address) => typeof address === "string" && utils.isAddress(address),
);

// Important for address check to come before ENS so network request is only made when necessary
export const AddressOrEnsSchema = z.union([AddressSchema, EnsSchema], {
  invalid_type_error: "Provided value was not a valid address or ENS name",
});

export const RawDateSchema = z.date().transform((i) => {
  return BigNumber.from(Math.floor(i.getTime() / 1000));
});

/**
 * Default to now
 */
export const StartDateSchema = RawDateSchema.default(new Date(0));

/**
 * Default to 10 years from now
 */
export const EndDateSchema = RawDateSchema.default(
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
);

export const CallOverrideSchema: z.ZodType<CallOverrides> = z
  .object({
    gasLimit: BigNumberishSchema.optional(),
    gasPrice: BigNumberishSchema.optional(),
    maxFeePerGas: BigNumberishSchema.optional(),
    maxPriorityFeePerGas: BigNumberishSchema.optional(),
    nonce: BigNumberishSchema.optional(),
    value: BigNumberishSchema.optional(),
    blockTag: z.union([z.string(), z.number()]).optional(),
    from: AddressOrEnsSchema.optional(),
    type: z.number().optional(),
  })
  .strict();

export const ChainInfoInputSchema = z.object({
  rpc: z.array(z.string().url()),
  chainId: z.number(),
  nativeCurrency: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }),
  slug: z.string(),
});

export type ChainInfo = z.infer<typeof ChainInfoInputSchema>;

// Use this everywhere even though it's just string so we can optionally switch it out
// more easily if we want to later
export type AddressOrEns = z.input<typeof AddressOrEnsSchema>;
export type Ens = `${string}.eth` | `${string}.cb.id`;
export type Address = string; // `0x${string}`;
