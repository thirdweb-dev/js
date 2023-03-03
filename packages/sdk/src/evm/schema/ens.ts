import { resolveEns } from "../common/ens";
import { utils } from "ethers";
import { z } from "zod";

export const EnsSchema = z
  .string()
  .transform(async (ens) => resolveEns(ens))
  .refine(
    (address): address is string => !!address && utils.isAddress(address),
    {
      message: "Provided value was not a valid ENS name",
    },
  );
