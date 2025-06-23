import { getContract, type ThirdwebContract } from "../contract/contract.js";
import { getOrDeployInfraContract } from "../contract/deployment/utils/bootstrap.js";
import type { ClientAndChainAndAccount } from "../utils/types.js";
import { IMPLEMENTATIONS } from "./constants.js";

export async function getOrDeployERC20AssetImpl(
  options: ClientAndChainAndAccount,
): Promise<ThirdwebContract> {
  const implementations = IMPLEMENTATIONS[options.chain.id];

  if (implementations?.ERC20AssetImpl) {
    return getContract({
      address: implementations.ERC20AssetImpl,
      chain: options.chain,
      client: options.client,
    });
  }

  return await getOrDeployInfraContract({
    ...options,
    contractId: "ERC20Asset",
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
  });
}
