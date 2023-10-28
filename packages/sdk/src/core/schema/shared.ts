import BN from "bn.js";
import { BigNumber } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const isBrowser = () => typeof window !== "undefined";
/**
 * @internal
 */
export const FileOrBufferUnionSchema = /* @__PURE__ */ (() =>
  isBrowser()
    ? (z.instanceof(File) as z.ZodType<InstanceType<typeof File>>)
    : // @fixme, this is a hack to make browser happy for now
      (z.instanceof(Uint8Array) as z.ZodTypeAny))();

/**
 * @internal
 */
export const FileOrBufferSchema = /* @__PURE__ */ (() =>
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

export const BigNumberSchema = /* @__PURE__ */ (() =>
  z
    .union([
      z.string(),
      z.number(),
      z.bigint(),
      z.custom<BigNumber>((data) => {
        return BigNumber.isBigNumber(data);
      }),
      z.custom<BN>((data) => {
        return BN.isBN(data);
      }),
    ])
    .transform((arg) => {
      const str = BN.isBN(arg)
        ? new BN(arg).toString()
        : BigNumber.from(arg).toString();
      return BigNumber.from(str);
    }))();

export const BigNumberishSchema = /* @__PURE__ */ (() =>
  BigNumberSchema.transform((arg) => arg.toString()))();

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
export type Amount = z.input<typeof AmountSchema>;

/**
 * @internal
 */
export const QuantitySchema = /* @__PURE__ */ (() =>
  z.union([AmountSchema, z.literal("unlimited")]).default("unlimited"))();

export type Quantity = z.output<typeof QuantitySchema>;

export const RawDateSchema = /* @__PURE__ */ (() =>
  z.date().transform((i) => {
    return BigNumber.from(Math.floor(i.getTime() / 1000));
  }))();

/**
 * Default to now
 */
export const StartDateSchema = /* @__PURE__ */ (() =>
  RawDateSchema.default(new Date(0)))();

/**
 * Default to 10 years from now
 */
export const EndDateSchema = /* @__PURE__ */ (() =>
  RawDateSchema.default(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
  ))();
