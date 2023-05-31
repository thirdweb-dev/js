// handle browser vs node global
globalThis.global = globalThis;

export type { NetworkInput } from "./core/types";
export type { ContractType } from "./contracts";

export type { Role } from "./common/role";

export * from "./schema/contracts/custom";
export * from "./schema/contracts/common/claim-conditions";
export * from "./schema/tokens/common/properties";
export * from "./schema/tokens/token";
export * from "./schema/tokens/edition";
export * from "./schema/contracts/common";
export * from "./schema/shared";
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
