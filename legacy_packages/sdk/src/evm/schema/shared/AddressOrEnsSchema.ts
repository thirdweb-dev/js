import { EnsSchema } from "../ens";
import { z } from "zod";
import { AddressSchema } from "./AddressSchema";

// Important for address check to come before ENS so network request is only made when necessary
export const AddressOrEnsSchema = /* @__PURE__ */ (() =>
  z.union([AddressSchema, EnsSchema], {
    invalid_type_error: "Provided value was not a valid address or ENS name",
  }))();

// Use this everywhere even though it's just string so we can optionally switch it out
// more easily if we want to later
export type AddressOrEns = z.input<typeof AddressOrEnsSchema>;
