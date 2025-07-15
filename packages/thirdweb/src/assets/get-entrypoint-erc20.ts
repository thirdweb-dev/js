import { getContract, type ThirdwebContract } from "../contract/contract.js";
import type {
  ClientAndChain,
  ClientAndChainAndAccount,
} from "../utils/types.js";
import {
  IMPLEMENTATIONS,
} from "./constants.js";

export async function getOrDeployEntrypointERC20(
  options: ClientAndChainAndAccount,
): Promise<ThirdwebContract> {
  const implementations = IMPLEMENTATIONS[options.chain.id];

  if (implementations?.AssetEntrypointERC20) {
    return getContract({
      address: implementations.AssetEntrypointERC20,
      chain: options.chain,
      client: options.client,
    });
  }

  // TODO: Dynamically deploy asset factory if not already deployed
  throw new Error("Asset factory deployment is not deployed yet.");
}

export async function getDeployedEntrypointERC20(options: ClientAndChain) {
  const implementations = IMPLEMENTATIONS[options.chain.id];

  if (implementations?.AssetEntrypointERC20) {
    return getContract({
      address: implementations.AssetEntrypointERC20,
      chain: options.chain,
      client: options.client,
    });
  }

  throw new Error("Asset factory deployment is not deployed yet.");
}
