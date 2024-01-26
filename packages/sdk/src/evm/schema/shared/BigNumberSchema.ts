import { BigNumber } from "ethers";
import { z } from "zod";

export const BigNumberSchema = /* @__PURE__ */ (() =>
  z
    .union([
      z.string(),
      z.number(),
      z.bigint(),
      z.custom<BigNumber>((data) => {
        return BigNumber.isBigNumber(data);
      }),
    ])
    .transform((arg) => BigNumber.from(arg)))();

export const BigNumberishSchema = /* @__PURE__ */ (() =>
  BigNumberSchema.transform((arg) => arg.toString()))();

export const BigNumberTransformSchema = /* @__PURE__ */ (() =>
  z
    .union([
      z.bigint(),
      z.custom<BigNumber>((data) => {
        return BigNumber.isBigNumber(data);
      }),
    ])
    .transform((arg) => {
      return BigNumber.from(arg).toString();
    }))();
