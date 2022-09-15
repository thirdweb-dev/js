// handle browser vs node global
globalThis.global = globalThis;

export type { ContractType, NetworkOrSignerOrProvider } from "./core/types";
export type {
  NFTMetadataInput,
  NFTMetadataOwner,
  NFTMetadata,
  NFTMetadataOrUri,
} from "./schema/tokens/common";

export type { Role } from "./common/role";

export { CommonContractSchema } from "./schema/contracts/common";
export * from "./schema/contracts/common/claim-conditions";
export * from "./schema/tokens/common/properties";
export * from "./constants/chains";
export * from "./schema/tokens/token";
export * from "./schema/tokens/edition";
export * from "./schema/contracts/common";
export * from "./schema/contracts/custom";
export * from "./schema/auth";
export type {
  SDKOptions,
  SDKOptionsSchema,
  SDKOptionsOutput,
} from "./schema/sdk-options";
export type { FeatureWithEnabled } from "./constants/contract-features";

export * from "./core";
export * from "./types";
export * from "./enums";
export * from "./common";
export * from "./constants";
export * from "./contracts";

// explcitly export the *TYPES* of prebuilt contracts
export type { EditionImpl } from "./contracts/prebuilt-implementations/edition";
export type { EditionDropImpl } from "./contracts/prebuilt-implementations/edition-drop";
export type { MarketplaceImpl } from "./contracts/prebuilt-implementations/marketplace";
export type { MultiwrapImpl } from "./contracts/prebuilt-implementations/multiwrap";
export type { NFTCollectionImpl } from "./contracts/prebuilt-implementations/nft-collection";
export type { NFTDropImpl } from "./contracts/prebuilt-implementations/nft-drop";
export type { PackImpl } from "./contracts/prebuilt-implementations/pack";
export type { SignatureDropImpl } from "./contracts/prebuilt-implementations/signature-drop";
export type { SplitImpl } from "./contracts/prebuilt-implementations/split";
export type { TokenImpl } from "./contracts/prebuilt-implementations/token";
export type { TokenDropImpl } from "./contracts/prebuilt-implementations/token-drop";
export type { VoteImpl } from "./contracts/prebuilt-implementations/vote";
