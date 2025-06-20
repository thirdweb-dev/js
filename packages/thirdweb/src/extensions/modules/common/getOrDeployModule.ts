import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getOrDeployInfraContract } from "../../../contract/deployment/utils/bootstrap.js";
import { getDeployedInfraContract } from "../../../contract/deployment/utils/infra.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";

/**
 * Gets or deploys a module implementation contract.
 * @param options - The options to use.
 * @returns The module.
 * @modules
 *
 * @example
 * ```ts
 * import { getOrDeployModule } from "thirdweb/modules";
 *
 * const module = await getOrDeployModule({
 *   client,
 *   chain,
 *   account,
 *   contractId,
 *   publisher,
 * });
 * ```
 */
export async function getOrDeployModule(options: {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  contractId: string;
  publisher?: string;
}) {
  const { client, chain, account, contractId, publisher } = options;
  const contract = await getOrDeployInfraContract({
    account,
    chain,
    client,
    contractId,
    publisher,
  });
  return contract;
}

/**
 * Gets a deployed module implementation contract.
 * @param options - The options to use.
 * @returns The module.
 * @modules
 *
 * @example
 * ```ts
 * import { getDeployedModule } from "thirdweb/modules";
 *
 * const module = await getDeployedModule({
 *   client,
 *   chain,
 *   contractId,
 *   publisher,
 * });
 * ```
 */
export async function getDeployedModule(options: {
  client: ThirdwebClient;
  chain: Chain;
  contractId: string;
  publisher?: string;
}) {
  const { client, chain, contractId, publisher } = options;
  return getDeployedInfraContract({
    chain,
    client,
    contractId,
    publisher,
  });
}
