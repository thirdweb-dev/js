import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { computeDeploymentInfoFromContractId } from "../../utils/any-evm/compute-published-contract-deploy-info.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChain } from "../../utils/types.js";
import { computeCreate2FactoryAddress } from "./utils/create-2-factory.js";

export type DeployDetemisiticParams = Prettify<
  ClientAndChain & {
    contractId: string;
    constructorParams: unknown[];
    publisher?: string;
    version?: string;
    salt?: string;
  }
>;

/**
 * Deploy a contract deterministically - will maintain the same address across chains.
 * This is meant to be used with published contracts configured with the 'direct deploy' method.
 * Under the hood, this uses a keyless transaction with a common create2 factory.
 * @param options - the options to deploy the contract
 * @returns - the transaction to deploy the contract
 * @extension DEPLOY
 * @example
 * ```ts
 * import { prepareDeterministicDeployTransaction } from "thirdweb/deploys";
 * import { sepolia } from "thirdweb/chains";
 *
 * const tx = prepareDeterministicDeployTransaction({
 *  client,
 *  chain: sepolia,
 *  contractId: "AccountFactory",
 *  constructorParams: [123],
 * });
 * ```
 */
export function prepareDeterministicDeployTransaction(
  options: DeployDetemisiticParams,
) {
  const { client, chain } = options;
  return prepareTransaction({
    client,
    chain,
    to: () =>
      computeCreate2FactoryAddress({
        client,
        chain,
      }),
    data: async () => {
      const infraContractInfo =
        await computeDeploymentInfoFromContractId(options);
      return infraContractInfo.initBytecodeWithsalt;
    },
  });
}
