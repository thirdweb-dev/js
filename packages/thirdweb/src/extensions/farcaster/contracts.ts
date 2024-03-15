import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import type { ThirdwebClient } from "../../client/client.js";
import { optimism } from "../../chains/chain-definitions/optimism.js";
import { ID_GATEWAY_ADDRESS, KEY_GATEWAY_ADDRESS } from "./constants.js";

export type FarcasterContractOptions = {
  client: ThirdwebClient;
};

export function getIdGateway({
  client,
}: FarcasterContractOptions): ThirdwebContract {
  return getContract({
    client,
    address: ID_GATEWAY_ADDRESS,
    chain: optimism,
  });
}

export function getKeyGateway({
  client,
}: FarcasterContractOptions): ThirdwebContract {
  return getContract({
    client,
    address: KEY_GATEWAY_ADDRESS,
    chain: optimism,
  });
}
