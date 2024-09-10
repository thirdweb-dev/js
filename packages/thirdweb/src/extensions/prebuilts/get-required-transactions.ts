import { getDeployedCreate2Factory } from "../../contract/deployment/utils/create-2-factory.js";
import { getDeployedInfraContract } from "../../contract/deployment/utils/infra.js";
import { getDeployedInfraContractFromMetadata } from "../../contract/deployment/utils/infra.js";
import { computePublishedContractAddress } from "../../utils/any-evm/compute-published-contract-address.js";
import type { DeployContractfromDeployMetadataOptions } from "./deploy-published.js";

/**
 * @internal
 */
export type DeployTransactionType =
  | "infra"
  | "implementation"
  | "module"
  | "proxy";

/**
 * @internal
 */
export type DeployTransactionResult = {
  type: DeployTransactionType;
  contractId: string;
};

/**
 * @internal
 */
export async function getRequiredTransactionCount(
  options: Omit<
    DeployContractfromDeployMetadataOptions,
    "account" | "initializeParams"
  >,
): Promise<DeployTransactionResult[]> {
  const {
    chain,
    client,
    deployMetadata,
    implementationConstructorParams,
    modules = [],
  } = options;

  if (deployMetadata?.deployType === "autoFactory") {
    const results: (DeployTransactionResult | null)[] = await Promise.all([
      getDeployedCreate2Factory({
        chain,
        client,
      }).then((c) =>
        c ? null : ({ type: "infra", contractId: "Create2Factory" } as const),
      ),
      getDeployedInfraContract({
        chain,
        client,
        contractId: "Forwarder",
      }).then((c) =>
        c ? null : ({ type: "infra", contractId: "Forwarder" } as const),
      ),
      getDeployedInfraContract({
        chain,
        client,
        contractId: "TWCloneFactory",
        constructorParams: {
          _trustedForwarder: await computePublishedContractAddress({
            chain,
            client,
            contractId: "Forwarder",
          }),
        },
      }).then((c) =>
        c ? null : ({ type: "infra", contractId: "TWCloneFactory" } as const),
      ),
      // TODO (deploy): add WETH contract check for implementations that need it (check implementation constructor params)
      getDeployedInfraContract({
        chain,
        client,
        contractId: deployMetadata.name,
        constructorParams: implementationConstructorParams,
        publisher: deployMetadata.publisher,
        version: deployMetadata.version,
      }).then((c) =>
        c
          ? null
          : ({
              type: "implementation",
              contractId: deployMetadata.name,
            } as const),
      ),
      ...modules.map((m) =>
        getDeployedInfraContractFromMetadata({
          chain,
          client,
          contractMetadata: m.deployMetadata,
        }).then((c) =>
          c
            ? null
            : ({
                type: "module",
                contractId: m.deployMetadata.name,
              } as const),
        ),
      ),
    ]);
    results.push({ type: "proxy", contractId: deployMetadata.name });
    return results.filter((r) => r !== null);
  }

  return [{ type: "implementation", contractId: deployMetadata.name }];
}
