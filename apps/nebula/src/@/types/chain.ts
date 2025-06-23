import type { ChainMetadata } from "thirdweb/chains";

type ChainSupportedService =
  | "contracts"
  | "connect-sdk"
  | "engine"
  | "account-abstraction"
  | "nebula"
  | "pay"
  | "rpc-edge"
  | "insight";

type ChainService = {
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
