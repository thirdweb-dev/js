import { utils } from "ethers";
import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];

export const JsonSchema: z.ZodType<Json> = z.lazy(
  () => z.union([literalSchema, z.array(JsonSchema), z.record(JsonSchema)]),
  { invalid_type_error: "Provided value was not valid JSON" },
);

export const AddressSchema = z.string().refine(
  (arg) => utils.isAddress(arg),
  (out) => {
    return {
      message: `${out} is not a valid address`,
    };
  },
);

export const RawDateSchema = z.date().transform((i) => {
  return Math.floor(i.getTime() / 1000);
});

export const AccountTypeSchema = z.literal("evm");

export type User<TContext extends Json = Json> = {
  address: string;
  session?: TContext;
};
