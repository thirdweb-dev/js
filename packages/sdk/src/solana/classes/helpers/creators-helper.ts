import { CreatorOutput } from "../../../core/schema/nft";
import { CreatorInput } from "../../types/programs";
import type { Creator } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

/**
 * @internal
 */
export function enforceCreator(
  creators: CreatorInput[] = [],
  owner: PublicKey,
): Creator[] {
  if (creators.length === 0) {
    // If no creators are specified, we assume the owner is the creator
    creators = creators.concat({
      address: owner.toBase58(),
      sharePercentage: 100,
      verified: true,
    });
  }
  return creators.map((creator) => ({
    verified: creator.verified || false,
    address: new PublicKey(creator.address),
    share: creator.sharePercentage,
  }));
}

/**
 * @internal
 */
export function parseCreators(creators: Creator[]): CreatorOutput[] {
  return creators.map((creator) => ({
    ...creator,
    address: creator.address.toBase58(),
  }));
}
