import type {
  AirdropInput,
  Amount,
  EditionDrop,
  Erc721,
  Erc721Mintable,
  Erc1155,
  Erc1155Mintable,
  ListingType,
  NFTDrop,
  NFTMetadata,
  Price,
  SignatureDrop,
  ValidContractInstance,
  SmartContract,
  NFTCollection,
  Edition,
  TokenDrop,
} from "@thirdweb-dev/sdk";
import {
  NFTMetadataInput,
  NFTMetadataOrUri,
} from "@thirdweb-dev/sdk/dist/declarations/src/schema";
import type { BigNumberish } from "ethers";
import invariant from "tiny-invariant";

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
 * const nftDrop = useNFTDrop(<ContractAddress>);
 * ```
 * @example
 * ```javascript
 * const editionDrop = useEditionDrop(<ContractAddress>);
 * ```
 * @example
 * ```javascript
 * const nftCollection = useNFTCollection(<ContractAddress>);
 * ```
 * @example
 * ```javascript
 * const edition = useEdition(<ContractAddress>);
 * ```
 * @example
 * ```javascript
 * const { contract } = useContract(<ContractAddress>);
 * const nftContract = contract?.nft;
 * ```
 * @beta
 */
export type NFTContract =
  | NFTCollection
  | Edition
  | Omit<DropContract, "TokenDrop">;

/**
 * A single NFT token
 * @beta
 */
export type NFT<TContract extends NFTContract> = {
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
 * The params to pass to `useTotalCirculatingSupply`.
 * @beta
 */
export type useTotalCirculatingSupplyParams<TContract> =
  TContract extends Erc1155
    ? [contract: RequiredParam<TContract>, tokenId: BigNumberish]
    : [contract: RequiredParam<TContract>];

/**
 * The params to pass to `useNftBalance`.
 * @beta
 */
export type useNFTBalanceParams<TContract> = TContract extends Erc1155
  ? [
      contract: RequiredParam<TContract>,
      ownerWalletAddress: RequiredParam<WalletAddress>,
      tokenId: RequiredParam<BigNumberish>,
    ]
  : [
      contract: RequiredParam<TContract>,
      ownerWalletAddress: RequiredParam<WalletAddress>,
    ];

/**
 * The params to pass to `useTransferNFT`.
 * @beta
 */
export type TransferNFTParams<TContract> = TContract extends Erc1155
  ? { to: WalletAddress; tokenId: BigNumberish; amount: Amount }
  : { to: WalletAddress; tokenId: BigNumberish };

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
export type MintNFTParams<TContract extends NFTContract> =
  TContract extends Erc1155
    ? { metadata: NFTMetadataOrUri; supply: BigNumberish; to: WalletAddress }
    : { metadata: NFTMetadataOrUri; to: WalletAddress };

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
export type BurnNFTParams<TContract extends NFTContract> =
  TContract extends Erc1155
    ? { tokenId: BigNumberish; amount: Amount }
    : { tokenId: BigNumberish };

// DROPS //

/**
 * The possible DROP contract types.
 * @beta
 */
export type DropContract =
  | NFTDrop
  | EditionDrop
  | SignatureDrop
  | TokenDrop
  | SmartContract;

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
export type ClaimNFTParams<TContract extends DropContract> =
  keyof TContract extends Erc1155
    ? {
        to: WalletAddress;
        tokenId: BigNumberish;
        quantity: BigNumberish;
        checkERC20Allowance?: boolean;
      }
    : {
        to: WalletAddress;
        quantity: BigNumberish;
        checkERC20Allowance?: boolean;
      };

/**
 * The return type of the {@link useClaimNFT} hook.
 *
 * @beta
 */
export type ClaimNFTReturnType<TContract extends DropContract> =
  TContract extends Erc721
    ? Awaited<ReturnType<TContract["claimTo"]>>
    : TContract extends Erc1155
    ? Awaited<ReturnType<TContract["claimTo"]>>
    : never;

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

export function getErc721Or1155(
  contract: ValidContractInstance | SmartContract,
) {
  const ercVariant =
    "erc721" in contract
      ? contract.erc721
      : "erc1155" in contract
      ? contract.erc1155
      : undefined;
  invariant(ercVariant, "Contract instance does not support erc721 or erc1155");
  return ercVariant;
}

export function getErc721Or1155OrErc20(
  contract: ValidContractInstance | SmartContract,
) {
  const ercVariant =
    "erc721" in contract
      ? contract.erc721
      : "erc1155" in contract
      ? contract.erc1155
      : "erc20" in contract
      ? contract.erc20
      : undefined;
  invariant(
    ercVariant,
    "Contract instance does not support erc721 or erc1155 or erc20",
  );
  return ercVariant;
}
