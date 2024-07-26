import { extractFunctionParamsFromAbi } from "@thirdweb-dev/sdk";
import { polygon } from "thirdweb/chains";
import invariant from "tiny-invariant";
import {
  fetchAllVersions,
  fetchContractPublishMetadataFromURI,
} from "../../../../components/contract-components/hooks";
import { getDashboardChainRpc } from "../../../../lib/rpc";
import { getThirdwebSDK } from "../../../../lib/sdk";
import type { ExtensionMeta } from "./install-extension-params";

export async function getExtensionInstalledParams(ext: ExtensionMeta) {
  const sdk = getThirdwebSDK(polygon.id, getDashboardChainRpc(polygon.id));

  // get all versions of the extension
  const allPublishedExtensions = await fetchAllVersions(
    sdk,
    ext.publisherAddress,
    ext.extensionName,
  );

  // find the version we want
  const publishedExtension =
    ext.extensionVersion === "latest"
      ? allPublishedExtensions[0]
      : allPublishedExtensions.find((v) => v.version === ext.extensionVersion);

  invariant(
    publishedExtension,
    `Extension ${ext.extensionName} version "${ext.extensionVersion}" not found`,
  );

  // get the ABI
  const contractMetadata = await fetchContractPublishMetadataFromURI(
    publishedExtension.metadataUri,
  );

  invariant(
    contractMetadata.abi,
    `ABI not found for extension ${ext.extensionName}`,
  );

  // get encodeBytesOnInstall function's install params
  const installParamsForExtension = extractFunctionParamsFromAbi(
    contractMetadata.abi,
    "encodeBytesOnInstall",
  );

  return {
    extensionName: ext.extensionName,
    params: installParamsForExtension,
  };
}
