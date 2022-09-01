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
