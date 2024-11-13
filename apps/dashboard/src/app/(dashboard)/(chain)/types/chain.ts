import type { ChainMetadata } from "thirdweb/chains";

export type ChainSupportedService =
  | "contracts"
  | "connect-sdk"
  | "engine"
  | "account-abstraction"
  | "pay"
  | "rpc-edge"
  | "chainsaw"
  | "insight";

export type ChainService = {
  service: ChainSupportedService;
  enabled: boolean;
  status: "enabled" | "disabled";
};

export type ChainServices = {
  chainId: number;
  services: Array<ChainService>;
};

export type ChainMetadataWithServices = ChainMetadata & {
  services: Array<ChainService>;
};
