// handle browser vs node global
// eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
globalThis.global = globalThis;

export type { ContractType } from "./contracts";

export type { Role } from "./common/role";

export * from "./schema/contracts/custom";
export * from "./schema/contracts/common/claim-conditions";
export * from "./schema/tokens/common/properties";
export * from "./schema/tokens/token";
export * from "./schema/tokens/edition";
export * from "./schema/contracts/common";

// shared
export * from "./schema/shared/BigNumberSchema";
export * from "./schema/shared/AddressSchema";
export * from "./schema/shared/AddressOrEnsSchema";
export * from "./schema/shared/RawDateSchema";
export * from "./schema/shared/CallOverrideSchema";
export * from "./schema/shared/ChainInfo";
export * from "./schema/shared/Ens";
export * from "./schema/shared/Address";

export type {
  SDKOptions,
  SDKOptionsSchema,
  SDKOptionsOutput,
} from "./schema/sdk-options";
export type { FeatureWithEnabled } from "./constants/contract-features";

// ./packages/sdk/src/evm/core
export * from "./core/types";
export * from "./core/classes/contract-encoder";
export * from "./core/classes/contract-metadata";
export * from "./core/classes/contract-roles";
export * from "./core/classes/contract-royalty";
export * from "./core/classes/contract-sales";
export * from "./core/classes/delayed-reveal";
export * from "./core/classes/drop-claim-conditions";
export * from "./core/classes/drop-erc1155-claim-conditions";
export * from "./core/classes/drop-erc1155-history";
export * from "./core/classes/erc-20-batch-mintable";
export * from "./core/classes/erc-20-burnable";
export * from "./core/classes/erc-20-claim-conditions";
export * from "./core/classes/erc-20-droppable";
export * from "./core/classes/erc-20-mintable";
export * from "./core/classes/erc-20-signature-mintable";
export * from "./core/classes/erc-20";
export * from "./core/classes/erc-20-history";
export * from "./core/classes/erc-20-standard";
export * from "./core/classes/erc-721-batch-mintable";
export * from "./core/classes/erc-721-claim-conditions";
export * from "./core/classes/erc-721-claimable";
export * from "./core/classes/erc-721-lazy-mintable";
export * from "./core/classes/erc-721-mintable";
export * from "./core/classes/erc-721-supply";
export * from "./core/classes/erc-721-enumerable";
export * from "./core/classes/erc-721-tiered-drop";
export * from "./core/classes/erc-721";
export * from "./core/classes/erc-721-with-quantity-signature-mintable";
export * from "./core/classes/erc-721-burnable";
export * from "./core/classes/erc-721-standard";
export * from "./core/classes/erc-1155-batch-mintable";
export * from "./core/classes/erc-1155-burnable";
export * from "./core/classes/erc-1155-enumerable";
export * from "./core/classes/erc-1155-lazy-mintable";
export * from "./core/classes/erc-1155-mintable";
export * from "./core/classes/erc-1155";
export * from "./core/classes/erc-1155-signature-mintable";
export * from "./core/classes/erc-1155-standard";
export * from "./core/classes/marketplace-direct";
export * from "./core/classes/marketplace-auction";
export * from "./core/classes/marketplacev3-direct-listings";
export * from "./core/classes/marketplacev3-english-auction";
export * from "./core/classes/marketplacev3-offers";
export * from "./core/classes/gas-cost-estimator";
export * from "./core/classes/delayed-reveal";
export * from "./core/classes/contract-events";
export * from "./core/classes/contract-interceptor";
export * from "./core/classes/contract-platform-fee";
export * from "./core/classes/contract-published-metadata";
export * from "./core/classes/contract-owner";
export * from "./core/classes/transactions";
export * from "./core/classes/contract-appuri";
export * from "./core/classes/account";
export * from "./core/classes/account-factory";
export * from "./core/wallet/user-wallet";
export * from "./core/sdk";

export * from "./types";
export * from "./enums";
export * from "./common";
export * from "./constants";
export * from "./contracts";

export { StaticJsonRpcBatchProvider } from "./lib/static-batch-rpc";

// export integration things
export * from "./integrations/thirdweb-checkout";

// explicitly export the *TYPES* of prebuilt contracts
export type { Edition } from "./contracts/prebuilt-implementations/edition";
export type { EditionDrop } from "./contracts/prebuilt-implementations/edition-drop";
export type { Marketplace } from "./contracts/prebuilt-implementations/marketplace";
export type { MarketplaceV3 } from "./contracts/prebuilt-implementations/marketplacev3";
export type { Multiwrap } from "./contracts/prebuilt-implementations/multiwrap";
export type { NFTCollection } from "./contracts/prebuilt-implementations/nft-collection";
export type { NFTDrop } from "./contracts/prebuilt-implementations/nft-drop";
export type { Pack } from "./contracts/prebuilt-implementations/pack";
export type { SignatureDrop } from "./contracts/prebuilt-implementations/signature-drop";
export type { Split } from "./contracts/prebuilt-implementations/split";
export type { Token } from "./contracts/prebuilt-implementations/token";
export type { TokenDrop } from "./contracts/prebuilt-implementations/token-drop";
export type { Vote } from "./contracts/prebuilt-implementations/vote";
export type { SmartContract } from "./contracts/smart-contract";

// re-export from functions entry point
export * from "./functions";

// marketplace v3 types
export type { DirectListingInputParams } from "./schema/marketplacev3/direct-listings";
export type { EnglishAuctionInputParams } from "./schema/marketplacev3/english-auctions";
