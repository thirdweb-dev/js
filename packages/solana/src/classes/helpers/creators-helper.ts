import { NFTCollectionMetadataInput } from "../../types/contracts";
import type { Creator } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

export function enforceCreator(
  creators: NFTCollectionMetadataInput["creators"] = [],
  owner: PublicKey,
): Creator[] {
  if (creators.length === 0) {
    // If no creators are specified, we assume the owner is the creator
    creators = creators.concat({
      address: owner.toBase58(),
      share: 100,
      verified: true,
    });
  }
  return creators.map((creator) => ({
    ...creator,
    verified: creator.verified || false,
    address: new PublicKey(creator.address),
  }));
}
