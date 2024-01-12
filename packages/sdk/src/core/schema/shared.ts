import BN from "bn.js";
import { BigNumber } from "ethers";
import { z } from "zod";
import { isBrowser } from "../../evm/common/utils";

/**
 * @internal
 */
const FileOrBufferUnionSchema = /* @__PURE__ */ (() =>
  isBrowser()
    ? (z.instanceof(File) as z.ZodType<InstanceType<typeof File>>)
    : // @fixme, this is a hack to make browser happy for now
      (z.instanceof(Buffer) as z.ZodTypeAny))();

/**
 * @internal
 */
const FileOrBufferSchema = /* @__PURE__ */ (() =>
  z.union([
    FileOrBufferUnionSchema,
    z.object({
      data: z.union([FileOrBufferUnionSchema, z.string()]),
      name: z.string(),
    }),
  ]))();

/**
 * @internal
 */
export const FileOrBufferOrStringSchema = /* @__PURE__ */ (() =>
  z.union([FileOrBufferSchema, z.string()]))();

export const MAX_BPS = 10000;

export const BytesLikeSchema = /* @__PURE__ */ (() =>
  z.union([z.array(z.number()), z.string()]))();

export const BigNumberTransformSchema = /* @__PURE__ */ (() =>
  z
    .union([
      z.bigint(),
      z.custom<BigNumber>((data) => {
        return BigNumber.isBigNumber(data);
      }),
      z.custom<BN>((data) => {
        return BN.isBN(data);
      }),
    ])
    .transform((arg) => {
      if (BN.isBN(arg)) {
        return new BN(arg).toString();
      }
      return BigNumber.from(arg).toString();
    }))();

export const BasisPointsSchema = /* @__PURE__ */ (() =>
  z.number().max(MAX_BPS, "Cannot exceed 100%").min(0, "Cannot be below 0%"))();

export const PercentSchema = /* @__PURE__ */ (() =>
  z.number().max(100, "Cannot exceed 100%").min(0, "Cannot be below 0%"))();

export const HexColor = /* @__PURE__ */ (() =>
  z.union([
    z.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color")
      .transform((val) => val.replace("#", "")),
    z.string().length(0),
  ]))();

export const AmountSchema = /* @__PURE__ */ (() =>
  z
    .union([
      z.string().regex(/^([0-9]+\.?[0-9]*|\.[0-9]+)$/, "Invalid amount"),
      z.number().min(0, "Amount cannot be negative"),
    ])
    .transform((arg) => (typeof arg === "number" ? arg.toString() : arg)))();

/**
 * @internal
 */
export const QuantitySchema = /* @__PURE__ */ (() =>
  z.union([AmountSchema, z.literal("unlimited")]).default("unlimited"))();

export type Quantity = z.output<typeof QuantitySchema>;
