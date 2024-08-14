import { extractFunctionParamsFromAbi } from "@thirdweb-dev/sdk";
import { polygon } from "thirdweb/chains";
import invariant from "tiny-invariant";
import {
  fetchAllVersions,
  fetchContractPublishMetadataFromURI,
} from "../../../../components/contract-components/hooks";
import { getDashboardChainRpc } from "../../../../lib/rpc";
import { getThirdwebSDK } from "../../../../lib/sdk";
import type { ModuleMeta } from "./install-module-params";

export async function getModuleInstalledParams(ext: ModuleMeta) {
  const sdk = getThirdwebSDK(
    polygon.id,
    getDashboardChainRpc(polygon.id, undefined),
  );

  // get all versions of the module
  const allPublishedModules = await fetchAllVersions(
    sdk,
    ext.publisherAddress,
    ext.moduleName,
  );

  // find the version we want
  const publishedModule =
    ext.moduleVersion === "latest"
      ? allPublishedModules[0]
      : allPublishedModules.find((v) => v.version === ext.moduleVersion);

  invariant(
    publishedModule,
    `Module ${ext.moduleName} version "${ext.moduleVersion}" not found`,
  );

  // get the ABI
  const contractMetadata = await fetchContractPublishMetadataFromURI(
    publishedModule.metadataUri,
  );

  invariant(contractMetadata.abi, `ABI not found for module ${ext.moduleName}`);

  // get encodeBytesOnInstall function's install params
  const installParamsForModule = extractFunctionParamsFromAbi(
    contractMetadata.abi,
    "encodeBytesOnInstall",
  );

  return {
    moduleName: ext.moduleName,
    params: installParamsForModule,
  };
}
