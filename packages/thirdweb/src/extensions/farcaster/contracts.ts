import { getContract, type ThirdwebContract } from "src/contract/contract.js";
import { ID_GATEWAY_ADDRESS } from "./constants.js";
import type { ThirdwebClient } from "src/client/client.js";
import type { Abi } from "abitype";
import { optimism } from "src/exports/chains.js";

export type FarcasterContractOptions = {
  client: ThirdwebClient;
};

export function getIdGateway<const abi extends Abi = []>({
  client,
}: FarcasterContractOptions): ThirdwebContract<abi> {
  return getContract({
    client,
    address: ID_GATEWAY_ADDRESS,
    chain: optimism,
  });
}
