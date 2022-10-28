// handle browser vs node global
globalThis.global = globalThis;

export type { ContractType, NetworkOrSignerOrProvider } from "./core/types";

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

// export integration things
export * from "./integrations/paper-xyz";

// explcitly export the *TYPES* of prebuilt contracts
export type { Edition } from "./contracts/prebuilt-implementations/edition";
export type { EditionDrop } from "./contracts/prebuilt-implementations/edition-drop";
export type { Marketplace } from "./contracts/prebuilt-implementations/marketplace";
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
