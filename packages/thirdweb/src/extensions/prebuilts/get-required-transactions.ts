import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getDeployedCreate2Factory } from "../../contract/deployment/utils/create-2-factory.js";
import { getDeployedInfraContract } from "../../contract/deployment/utils/infra.js";
import { getDeployedInfraContractFromMetadata } from "../../contract/deployment/utils/infra.js";
import { computePublishedContractAddress } from "../../utils/any-evm/compute-published-contract-address.js";
import type { FetchDeployMetadataResult } from "../../utils/any-evm/deploy-metadata.js";

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
export async function getRequiredTransactionCount(options: {
  chain: Chain;
  client: ThirdwebClient;
  metadata: FetchDeployMetadataResult;
  constructorParams?: Record<string, unknown>;
  implementationConstructorParams?: Record<string, unknown>;
  modules?: FetchDeployMetadataResult[];
}): Promise<DeployTransactionResult[]> {
  const {
    chain,
    client,
    metadata,
    implementationConstructorParams,
    modules = [],
  } = options;

  if (metadata?.deployType === "autoFactory") {
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
        contractId: metadata.name,
        constructorParams: implementationConstructorParams,
        publisher: metadata.publisher,
        version: metadata.version,
      }).then((c) =>
        c
          ? null
          : ({
              type: "implementation",
              contractId: metadata.name,
            } as const),
      ),
      ...modules.map((m) =>
        getDeployedInfraContractFromMetadata({
          chain,
          client,
          contractMetadata: m,
        }).then((c) =>
          c
            ? null
            : ({
                type: "module",
                contractId: m.name,
              } as const),
        ),
      ),
    ]);
    results.push({ type: "proxy", contractId: metadata.name });
    return results.filter((r) => r !== null);
  }

  return [{ type: "implementation", contractId: metadata.name }];
}
