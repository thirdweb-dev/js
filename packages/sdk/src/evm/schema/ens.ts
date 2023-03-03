import { resolveEns } from "../common/ens";
import { utils } from "ethers";
import { z } from "zod";

// Only pass through to provider call if value ends with .eth or .cb.id
export const EnsSchema = z
  .string()
  .refine((ens) => ens.endsWith(".eth") || ens.endsWith(".cb.id"))
  .transform(async (ens) => resolveEns(ens))
  .refine(
    (address): address is string => !!address && utils.isAddress(address),
    {
      message: "Provided value was not a valid ENS name",
    },
  );
