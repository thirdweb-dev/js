/**
 * NFT-related analytics helpers (ERC721 & ERC1155 non-fungible).
 */

import { z } from "zod/v4-mini";
import { __internal__reportEvent } from "./__internal";
import { EVMAddressSchema, EVMChainIdSchema } from "./schemas";

const BaseNFTSchema = z.object({
  address: EVMAddressSchema,
  chainId: EVMChainIdSchema,
});

type NFTBasePayload = z.infer<typeof BaseNFTSchema>;

export function reportNFTMinted(
  payload: NFTBasePayload & { tokenId?: string },
) {
  __internal__reportEvent("nft minted", {
    ...BaseNFTSchema.parse(payload),
    tokenId: payload.tokenId,
  });
}
