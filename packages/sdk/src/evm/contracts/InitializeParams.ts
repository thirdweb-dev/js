import type { NetworkInput } from "../core/types";
import type { Address } from "../schema/shared/Address";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { SDKOptions } from "../schema/sdk-options";

// @internal
export type InitializeParams = [
  network: NetworkInput,
  address: Address,
  storage: ThirdwebStorage,
  options?: SDKOptions,
];
