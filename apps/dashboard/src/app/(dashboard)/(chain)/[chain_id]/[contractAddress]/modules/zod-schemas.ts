import { isAddress } from "thirdweb";
import { z } from "zod";

export const addressSchema = z.string().refine(
  (v) => {
    // not returning the return value of isAddress directly on purpose to prevent type narrowing to `0x${string}`
    if (isAddress(v)) {
      return true;
    }
    return false;
  },
  { message: "Invalid Address" },
);

export const fileBufferOrStringSchema = z.union([
  z.string(),
  z.instanceof(File),
  z.instanceof(Uint8Array),
  z.object({
    data: z.union([z.string(), z.instanceof(Uint8Array)]),
    name: z.string(),
  }),
]);
