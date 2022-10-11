import { Amount } from "@thirdweb-dev/sdk";

/**
 * The params for the {@link useClaimNFT} hook mutation.
 *
 * @beta
 */
export type ClaimNFTParams = {
  to?: string;
  amount: Amount;
};
