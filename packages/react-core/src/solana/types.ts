import { Amount, NFTMetadataOrUri } from "@thirdweb-dev/sdk";

/**
 * The params for the {@link useMintNFT} hook mutation.
 *
 * @beta
 */
export type MintNFTParams = {
  to?: string;
  metadata: NFTMetadataOrUri;
  amount?: Amount;
};

/**
 * The params for the {@link useClaimNFT} hook mutation.
 *
 * @beta
 */
export type ClaimNFTParams = {
  to?: string;
  amount: Amount;
};

/**
 * The params to pass to {@link useMintNFTSupply} hook mutation
 * @beta
 */
export type MintNFTSupplyParams = {
  to?: string;
  nftAddress: string;
  amount: Amount;
};
