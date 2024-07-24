import type { ChainMetadata } from "thirdweb/chains";

export type ChainSupportedService =
  | "contracts"
  | "connect-sdk"
  | "engine"
  | "account-abstraction"
  | "pay"
  | "faucet"
  | "rpc-edge";

export type ChainService = {
  service: ChainSupportedService;
  enabled: boolean;
};

export type ChainMetadataWithServices = ChainMetadata & {
  services: Array<ChainService>;
};
