import { isAddress } from "thirdweb";
import { z } from "zod/v4-mini";

// ---------------------------
// Shared Zod Schemas
// ---------------------------

/** Validates an EVM address (0x…) using thirdweb's `isAddress`. */
export const EVMAddressSchema = z.string().check(
  z.refine(isAddress, {
    message: "Invalid EVM address",
  }),
);

/** Coerces the chain ID into a number and checks it is positive. */
export const EVMChainIdSchema = z.coerce.number().check(
  z.gte(1, {
    message: "Invalid chain ID",
  }),
);
