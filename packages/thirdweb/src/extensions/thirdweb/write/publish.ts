import type { Abi } from "abitype";
import { encodePacked, keccak256, toFunctionSelector } from "viem/utils";
import { polygon } from "../../../chains/chain-definitions/polygon.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import { getContract } from "../../../contract/contract.js";
import { CONTRACT_PUBLISHER_ADDRESS } from "../../../contract/deployment/publisher.js";
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
    contract: options.contract,
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
        bytecodeUri: options.metadata.bytecodeUri,
        metadataUri: options.metadata.metadataUri,
        name: options.metadata.name,
        version: options.metadata.version,
        audit: options.metadata.audit,
        changelog: options.metadata.changelog,
        compositeAbi: options.metadata.compositeAbi,
        constructorParams: options.metadata.constructorParams,
        implConstructorParams: options.metadata.implConstructorParams,
        defaultExtensions: options.metadata.defaultExtensions,
        defaultModules: options.metadata.defaultModules,
        deployType: options.metadata.deployType,
        description: options.metadata.description,
        displayName: options.metadata.displayName,
        factoryDeploymentData: options.metadata.factoryDeploymentData,
        isDeployableViaFactory: options.metadata.isDeployableViaFactory,
        isDeployableViaProxy: options.metadata.isDeployableViaProxy,
        logo: options.metadata.logo,
        networksForDeployment: options.metadata.networksForDeployment,
        readme: options.metadata.readme,
        tags: options.metadata.tags,
        compilers: options.metadata.compilers,
        publisher: options.account.address,
        routerType,
      };

      // upload the new metadata
      const newMetadataUri = await upload({
        client: options.contract.client,
        files: [newMetadata],
      });

      return {
        publisher: options.account.address,
        contractId: options.metadata.name,
        publishMetadataUri: newMetadataUri,
        compilerMetadataUri: options.metadata.metadataUri,
        bytecodeHash,
        implementation: ZERO_ADDRESS,
      };
    },
  });
}

/**
 * Returns the default publisher contract on polygon
 * @utils
 */
export function getContractPublisher(client: ThirdwebClient) {
  return getContract({
    client,
    chain: polygon,
    address: CONTRACT_PUBLISHER_ADDRESS,
  });
}

function getRouterType(abi: Abi) {
  const fnSelectors = abi
    .filter((f) => f.type === "function")
    .map((f) => toFunctionSelector(f));
  const isModule = isGetInstalledModulesSupported(fnSelectors);
  // TODO add dynamic detection
  return isModule ? "modular" : "none";
}
