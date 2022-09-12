import type {
  AirdropInput,
  Amount,
  Erc721,
  Erc721Mintable,
  Erc1155,
  Erc1155Mintable,
  ListingType,
  NFTMetadata,
  NFTMetadataInput,
  NFTMetadataOrUri,
  Price,
  ValidContractInstance,
  Erc20,
  ClaimOptions,
} from "@thirdweb-dev/sdk";
import type { EditionImpl } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/edition";
import type { EditionDropImpl } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/edition-drop";
import type { NFTCollectionImpl } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/nft-collection";
import type { NFTDropImpl } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/nft-drop";
import type { SignatureDropImpl } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/signature-drop";
import type { TokenDropImpl } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/token-drop";
import type { SmartContract } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/smart-contract";
import type { BigNumberish } from "ethers";

/**
 * Makes a parameter required to be passed, but still allowes it to be undefined.
 *
 * @beta
 */
export type RequiredParam<T> = T | undefined;

/**
 * A wallet address.
 * @beta
 */
export type WalletAddress = string;

/**
 * A contract address.
 * @beta
 */
export type ContractAddress = string;

/**
 * The parameters to pass to the mint and transfer functions.
 *
 * @beta
 */
export type TokenParams = {
  to: WalletAddress;
  amount: Amount;
};

/**
 * The parameters to pass to the burn function.
 *
 * @beta
 */
export type TokenBurnParams = {
  amount: Amount;
};

// NFTS //

/**
 * The possible NFT contract types.
 * @example
 * ```javascript
 * const { contract } = useContract(<ContractAddress>);
 * ```
 * @beta
 */
export type NFTContract =
  | NFTCollectionImpl
  | EditionImpl
  | Exclude<DropContract, "TokenDrop">;

/**
 * Possible NFT contract types.
 * @beta
 */
export type Erc721OrErc1155 = Erc721 | Erc1155;

/**
 * A single NFT token
 * @beta
 */
export type NFT<TContract extends Erc721OrErc1155> = {
  /**
   * The actual metadata of the NFT (name, image, etc)
   */
  metadata: NFTMetadata;
  /**
   * The owner of the nft (this will be an empty string for ERC1155 tokens)
   */
  owner: string;
  /**
   * The type of the NFT (ERC721 or ERC1155)
   */
  type: TContract extends Erc721 ? "ERC721" : "ERC1155";
  /**
   * The total supply of the NFT (this will *always* be 1 for ERC721 tokens)
   */
  supply: TContract extends Erc721 ? 1 : number;

  [key: string]: unknown;
};

/**
 * The params to pass to `useTransferNFT`.
 * @beta
 */
export type TransferNFTParams = {
  to: WalletAddress;
  tokenId: BigNumberish;
  amount?: Amount;
};

/**
 * The params to pass to `useTransferBatchNFT`.
 * @beta
 */
export type AirdropNFTParams = {
  tokenId: BigNumberish;
  addresses: AirdropInput;
};

/**
 * The params to pass to `useMintNFTSupply`.
 * @beta
 */
export type MintNFTSupplyParams = {
  tokenId: BigNumberish;
  additionalSupply: Amount;
  to: WalletAddress;
};

/**
 * The params for the {@link useMintNFT} hook mutation.
 *
 * @beta
 */
export type MintNFTParams = {
  metadata: NFTMetadataOrUri;
  to: WalletAddress;
  supply?: Amount;
};

/**
 * The return type of the {@link useMintNFT} hook.
 *
 * @beta
 */
export type MintNFTReturnType<TContract> = TContract extends Erc721
  ? Awaited<ReturnType<Erc721Mintable["to"]>>
  : TContract extends Erc1155
  ? Awaited<ReturnType<Erc1155Mintable["to"]>>
  : never;

/**
 * The params for the {@link useBurnNFT} hook mutation.
 *
 * @beta
 */
export type BurnNFTParams = { tokenId: BigNumberish; amount?: Amount };

// DROPS //

/**
 * The possible DROP contract types.
 * @beta
 */
export type DropContract =
  | NFTDropImpl
  | EditionDropImpl
  | SignatureDropImpl
  | TokenDropImpl
  | SmartContract
  | null;

/**
 * The possible revealable contract types.
 * @beta
 */
export type RevealableContract =
  | NFTDropImpl
  | SignatureDropImpl
  | SmartContract
  | null;

/**
 * The params for the {@link useDelayedRevealLazyMint} hook mutation.
 *
 * @beta
 */
export type DelayedRevealLazyMintInput = {
  placeholder: NFTMetadataInput;
  metadatas: NFTMetadataInput[];
  password: string;
};

/**
 * The params for the {@link useRevealLazyMint} hook mutation.
 *
 * @beta
 */
export type RevealLazyMintInput = {
  batchId: BigNumberish;
  password: string;
};

/**
 * The params for the {@link useClaimNFT} hook mutation.
 *
 * @beta
 */
export type ClaimNFTParams = {
  to: WalletAddress;
  quantity: BigNumberish;
  options?: ClaimOptions;
  /**
   * tokenId is only used for ERC1155 tokens
   */
  tokenId?: BigNumberish;
};

/**
 * The return type of the {@link useClaimNFT} hook.
 *
 * @beta
 */
export type ClaimNFTReturnType =
  | Awaited<ReturnType<Erc721["claimTo"]>>
  | Awaited<ReturnType<Erc1155["claimTo"]>>;

// MARKETPLACE //

export type MakeBidParams = { listingId: BigNumberish; bid: Price };

export type BuyNowParams<TListingType = ListingType> =
  TListingType extends ListingType.Direct
    ? {
        id: BigNumberish;
        type: ListingType.Direct;
        buyAmount: BigNumberish;
        buyForWallet?: WalletAddress;
      }
    : {
        id: BigNumberish;
        type: ListingType.Auction;
      };

// TOKEN DROP //

export type ClaimTokenParams = {
  to: WalletAddress;
  amount: Amount;
  checkERC20Allowance?: boolean;
};

// Helpers

export function getErcs(contract: RequiredParam<ValidContractInstance | null>) {
  return {
    erc1155: getErc1155(contract),
    erc721: getErc721(contract),
    erc20: getErc20(contract),
  };
}

export function getErc1155(
  contract: RequiredParam<ValidContractInstance | null>,
): Erc1155 | undefined {
  if (!contract) {
    return undefined;
  }
  try {
    if ("erc1155" in contract) {
      return contract.erc1155;
    }
  } catch (error) {
    return undefined;
  }
  return undefined;
}

export function getErc721(
  contract: RequiredParam<ValidContractInstance | null>,
): Erc721 | undefined {
  if (!contract) {
    return undefined;
  }
  try {
    if ("erc721" in contract) {
      return contract.erc721;
    }
  } catch (error) {
    return undefined;
  }
  return undefined;
}

export function getErc20(
  contract: RequiredParam<ValidContractInstance | null>,
): Erc20 | undefined {
  if (!contract) {
    return undefined;
  }
  try {
    if ("erc20" in contract) {
      return contract.erc20;
    }
  } catch (error) {
    return undefined;
  }
  return undefined;
}
