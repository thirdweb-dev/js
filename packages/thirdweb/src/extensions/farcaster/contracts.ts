import { getContract, type ThirdwebContract } from "src/contract/contract.js";
import { ID_GATEWAY_ADDRESS } from "./constants.js";
import type { ThirdwebClient } from "src/client/client.js";
import { optimism } from "src/exports/chains.js";

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
