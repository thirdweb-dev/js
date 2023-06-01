import { BigNumber } from "ethers";
import { z } from "zod";

export const RawDateSchema = z.union([
  z.date().transform((i) => {
    return BigNumber.from(Math.floor(i.getTime() / 1000));
  }),
  z.number().transform((i) => {
    return BigNumber.from(i);
  }),
]);

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
