import { utils } from "ethers";
import { z } from "zod";
import { Address } from "./Address";

export const AddressSchema = /* @__PURE__ */ (() =>
  z.custom<Address>(
    (address) => typeof address === "string" && utils.isAddress(address),
    (out) => {
      return {
        message: `${out} is not a valid address`,
      };
    },
  ))();
