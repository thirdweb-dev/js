import { sol } from "@metaplex-foundation/js";
import { z } from "zod";

/**
 * @internal
 */
export const NFTDropContractSchema = z.object({
  price: z.number(),
  sellerFeeBasisPoints: z.number(),
  itemsAvailable: z.number(),
})

export type NFTDropMetadataInput = z.input<
  typeof NFTDropContractSchema
>;