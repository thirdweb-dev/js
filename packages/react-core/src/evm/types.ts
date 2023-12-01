import { RequiredParam } from "../core/query-utils/required-param";
import type {
  AirdropInput,
  Amount,
  Erc721,
  Erc721Mintable,
  Erc1155,
  Erc1155Mintable,
  ListingType,
  NFTMetadataInput,
  Price,
  ValidContractInstance,
  Erc20,
  ClaimOptions,
  NFTMetadataOrUri,
  Token,
  Multiwrap,
  Pack,
  AddressOrEns,
} from "@thirdweb-dev/sdk";
import type { Edition } from "@thirdweb-dev/sdk";
import type { EditionDrop } from "@thirdweb-dev/sdk";
import type { NFTCollection } from "@thirdweb-dev/sdk";
import type { NFTDrop } from "@thirdweb-dev/sdk";
import type { SignatureDrop } from "@thirdweb-dev/sdk";
import type { TokenDrop } from "@thirdweb-dev/sdk";
import type { SmartContract } from "@thirdweb-dev/sdk";
import type { BigNumberish } from "ethers";

type AddEthereumChainParameter = {
  chainId: string;
  chainName: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
};

export type Chain = {
  id: number;
  name: AddEthereumChainParameter["chainName"];
  nativeCurrency?: AddEthereumChainParameter["nativeCurrency"];
  rpcUrls: AddEthereumChainParameter["rpcUrls"];
  blockExplorers?: {
    name: string;
    url: string;
  }[];
  testnet?: boolean;
};

/**
 * A wallet address.
 */
export type WalletAddress = AddressOrEns;

/**
 * A contract address.
 */
export type ContractAddress = AddressOrEns;

/**
 * The parameters to pass to the mint and transfer functions.
 *
 */
export type TokenParams = {
  to: WalletAddress;
  amount: Amount;
};

/**
 * The parameters to pass to the burn function.
 *
 */
export type TokenBurnParams = {
  amount: Amount;
};

// NFTS //

/**
 * The possible NFT contract types.
 * @example
 * ```javascript
 * const { contract } = useContract("{{contract_address}}");
 * ```
 */
export type NFTContract =
  | NFTCollection
  | Edition
  | Pack
  | Multiwrap
  | Exclude<DropContract, "TokenDrop">;

/**
 * The possible Token contract types.
 * @example
 * ```javascript
 * const { contract } = useContract("{{contract_address}}");
 * ```
 */
export type TokenContract = TokenDrop | Token | SmartContract | null;

/**
 * Possible NFT contract types.
 */
export type Erc721OrErc1155 = Erc721 | Erc1155;

/**
 * The params to pass to `useTransferNFT`.
 */
export type TransferNFTParams = {
  to: WalletAddress;
  tokenId: BigNumberish;
  amount?: Amount;
};

/**
 * The params to pass to `useTransferBatchNFT`.
 */
export type AirdropNFTParams = {
  tokenId: BigNumberish;
  addresses: AirdropInput;
};

/**
 * The params to pass to `useMintNFTSupply`.
 */
export type MintNFTSupplyParams = {
  tokenId: BigNumberish;
  additionalSupply: Amount;
  to: WalletAddress;
};

/**
 * The params for the {@link useMintNFT} hook mutation.
 *
 */
export type MintNFTParams = {
  metadata: NFTMetadataOrUri;
  to: WalletAddress;
  supply?: Amount;
};

/**
 * The return type of the {@link useMintNFT} hook.
 *
 */
export type MintNFTReturnType<TContract> = TContract extends Erc721
  ? Awaited<ReturnType<Erc721Mintable["to"]>>
  : TContract extends Erc1155
  ? Awaited<ReturnType<Erc1155Mintable["to"]>>
  : never;

/**
 * The params for the {@link useBurnNFT} hook mutation.
 *
 */
export type BurnNFTParams = { tokenId: BigNumberish; amount?: Amount };

// DROPS //

/**
 * The possible DROP contract types.
 */
export type DropContract =
  | NFTDrop
  | EditionDrop
  | SignatureDrop
  | TokenDrop
  | SmartContract
  | null;

/**
 * The possible revealable contract types.
 */
export type RevealableContract = NFTDrop | SignatureDrop | SmartContract | null;

/**
 * The params for the {@link useDelayedRevealLazyMint} hook mutation.
 *
 */
export type DelayedRevealLazyMintInput = {
  placeholder: NFTMetadataInput;
  metadatas: NFTMetadataInput[];
  password: string;
};

/**
 * The params for the {@link useRevealLazyMint} hook mutation.
 *
 */
export type RevealLazyMintInput = {
  batchId: BigNumberish;
  password: string;
};

/**
 * The params for the {@link useClaimNFT} hook mutation.
 *
 */
export type ClaimNFTParams = {
  to?: WalletAddress;
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
 */
export type ClaimNFTReturnType =
  | Awaited<ReturnType<Erc721["claimTo"]>>
  | Awaited<ReturnType<Erc1155["claimTo"]>>;

// MARKETPLACE //

export type MakeBidParams = { listingId: BigNumberish; bid: Price };
export type MakeOfferParams = {
  listingId: BigNumberish;
  pricePerToken: Price;
  quantity?: Amount;
};
export type AcceptDirectOffer = {
  listingId: BigNumberish;
  addressOfOfferor: string;
};
export type ExecuteAuctionSale = {
  listingId: BigNumberish;
};

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

export type BuyFromListingParams = {
  listingId: string;
  quantity: Amount;
  buyer: WalletAddress;
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
