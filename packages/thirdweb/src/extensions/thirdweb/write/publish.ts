import type { Abi } from "abitype";
import { encodePacked, keccak256, toFunctionSelector } from "viem/utils";
import { polygon } from "../../../chains/chain-definitions/polygon.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import { getContract } from "../../../contract/contract.js";
import { CONTRACT_PUBLISHER_ADDRESS } from "../../../contract/deployment/publisher.js";
import { isGetAllExtensionsSupported } from "../../../extensions/dynamic-contracts/__generated__/IExtensionManager/read/getAllExtensions.js";
import { download } from "../../../storage/download.js";
import { upload } from "../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type {
  ExtendedMetadata,
  FetchDeployMetadataResult,
} from "../../../utils/any-evm/deploy-metadata.js";
import { ensureBytecodePrefix } from "../../../utils/bytecode/prefix.js";
import { isIncrementalVersion } from "../../../utils/semver.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { isGetInstalledModulesSupported } from "../../modules/__generated__/IModularCore/read/getInstalledModules.js";
import { publishContract as generatedPublishContract } from "../__generated__/IContractPublisher/write/publishContract.js";

export type PublishContractParams = {
  account: Account;
  metadata: FetchDeployMetadataResult & {
    version: string;
  };
  previousMetadata?: FetchDeployMetadataResult;
};

/**
 * Publish a contract to the contract publisher.
 *
 * @param options - The options for publishing the contract.
 * @returns The transaction to publish the contract.
 * @example
 * ```ts
 * const tx = publishContract({
 *   contract,
 *   account,
 *   metadata,
 * });
 * ```
 * @extension THIRDWEB
 */
export function publishContract(
  options: BaseTransactionOptions<PublishContractParams>,
) {
  return generatedPublishContract({
    async asyncParams() {
      const currentVersion = options.previousMetadata?.version;
      // check if the version is greater than the current version
      if (
        currentVersion &&
        !isIncrementalVersion(currentVersion, options.metadata.version)
      ) {
        throw Error(
          `Version ${options.metadata.version} is not greater than ${currentVersion}`,
        );
      }
      // hash the bytecode
      const bytecode = await download({
        client: options.contract.client,
        uri: options.metadata.bytecodeUri,
      }).then((r) => r.text());
      const bytecodeHash = keccak256(
        encodePacked(["bytes"], [ensureBytecodePrefix(bytecode)]),
      );

      const abi = options.metadata.abi;
      const routerType = getRouterType(abi);
      // not spreading here, we don't want to re-upload the fetched data like bytecode
      const newMetadata: ExtendedMetadata = {
        audit: options.metadata.audit,
        bytecodeUri: options.metadata.bytecodeUri,
        changelog: options.metadata.changelog,
        compilers: options.metadata.compilers,
        compositeAbi: options.metadata.compositeAbi,
        constructorParams: options.metadata.constructorParams,
        defaultExtensions:
          routerType === "dynamic"
            ? options.metadata.defaultExtensions
            : undefined,
        defaultModules:
          routerType === "modular"
            ? options.metadata.defaultModules
            : undefined,
        deployType: options.metadata.deployType,
        description: options.metadata.description,
        displayName: options.metadata.displayName,
        factoryDeploymentData: options.metadata.factoryDeploymentData,
        implConstructorParams: options.metadata.implConstructorParams,
        isDeployableViaFactory: options.metadata.isDeployableViaFactory,
        isDeployableViaProxy: options.metadata.isDeployableViaProxy,
        logo: options.metadata.logo,
        metadataUri: options.metadata.metadataUri,
        name: options.metadata.name,
        networksForDeployment: options.metadata.networksForDeployment,
        publisher: options.account.address,
        readme: options.metadata.readme,
        routerType,
        tags: options.metadata.tags,
        version: options.metadata.version,
      };

      // upload the new metadata
      const newMetadataUri = await upload({
        client: options.contract.client,
        files: [newMetadata],
      });

      return {
        bytecodeHash,
        compilerMetadataUri: options.metadata.metadataUri,
        contractId: options.metadata.name,
        implementation: ZERO_ADDRESS,
        publisher: options.account.address,
        publishMetadataUri: newMetadataUri,
      };
    },
    contract: options.contract,
  });
}

/**
 * Returns the default publisher contract on polygon
 * @utils
 */
export function getContractPublisher(client: ThirdwebClient) {
  return getContract({
    address: CONTRACT_PUBLISHER_ADDRESS,
    chain: polygon,
    client,
  });
}

function getRouterType(abi: Abi) {
  const fnSelectors = abi
    .filter((f) => f.type === "function")
    .map((f) => toFunctionSelector(f));
  const isModule = isGetInstalledModulesSupported(fnSelectors);
  const isDynamic = isGetAllExtensionsSupported(fnSelectors);

  return isModule ? "modular" : isDynamic ? "dynamic" : "none";
}
