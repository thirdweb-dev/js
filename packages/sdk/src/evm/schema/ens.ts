import { resolveEns } from "../common/ens/resolveEns";
import { utils } from "ethers";
import { z } from "zod";

type EnsName = `${string}.eth` | `${string}.cb.id`;

// Only pass through to provider call if value ends with .eth or .cb.id
export const EnsSchema: z.ZodType<
  `0x${string}`,
  z.ZodTypeDef,
  `${string}.eth` | `${string}.cb.id`
> = /* @__PURE__ */ (() =>
  z
    .custom<EnsName>(
      (ens) =>
        typeof ens === "string" &&
        (ens.endsWith(".eth") || ens.endsWith(".cb.id")),
    )
    .transform(async (ens) => resolveEns(ens))
    .refine(
      (address): address is `0x${string}` =>
        !!address && utils.isAddress(address),
      {
        message: "Provided value was not a valid ENS name",
      },
    ))();
