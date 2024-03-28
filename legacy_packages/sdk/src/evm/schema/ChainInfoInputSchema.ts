import { z } from "zod";

export const ChainInfoInputSchema = /* @__PURE__ */ (() =>
  z.object({
    rpc: z.array(z.string().url()),
    chainId: z.number(),
    nativeCurrency: z.object({
      name: z.string(),
      symbol: z.string(),
      decimals: z.number(),
    }),
    slug: z.string(),
  }))();
