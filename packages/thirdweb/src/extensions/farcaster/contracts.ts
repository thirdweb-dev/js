import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import type { ThirdwebClient } from "../../client/client.js";
import { optimism } from "../../chains/chain-definitions/optimism.js";
import {
  ID_GATEWAY_ADDRESS,
  KEY_GATEWAY_ADDRESS,
  STORAGE_REGISTRY_ADDRESS,
} from "./constants.js";
import type { Chain } from "../../chains/types.js";

export type FarcasterContractOptions = {
  client: ThirdwebClient;
  chain?: Chain;
};

export function getIdGateway({
  client,
  chain,
}: FarcasterContractOptions): ThirdwebContract {
  return getContract({
    client,
    address: ID_GATEWAY_ADDRESS,
    chain: chain ?? optimism,
  });
}

export function getKeyGateway({
  client,
  chain,
}: FarcasterContractOptions): ThirdwebContract {
  return getContract({
    client,
    address: KEY_GATEWAY_ADDRESS,
    chain: chain ?? optimism,
  });
}

export function getStorageRegistry({
  client,
  chain,
}: FarcasterContractOptions): ThirdwebContract {
  return getContract({
    client,
    address: STORAGE_REGISTRY_ADDRESS,
    chain: chain ?? optimism,
  });
}
