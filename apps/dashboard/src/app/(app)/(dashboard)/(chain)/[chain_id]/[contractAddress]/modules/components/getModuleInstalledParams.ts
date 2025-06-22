import { isAddress, type ThirdwebClient } from "thirdweb";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import { resolveAddress } from "thirdweb/extensions/ens";
import invariant from "tiny-invariant";
import {
  fetchLatestPublishedContractVersion,
  fetchPublishedContractVersions,
} from "@/components/contract-components/fetch-contracts-with-versions";
import type { ModuleMeta } from "./install-module-params";

export async function getModuleInstalledParams(
  ext: ModuleMeta,
  client: ThirdwebClient,
) {
  // get all versions of the module
  // if the publisher is an ens name, resolve it
  const publisherAddress = isAddress(ext.publisherAddress)
    ? ext.publisherAddress
    : await resolveAddress({
        client,
        name: ext.publisherAddress,
      });

  let publishedModule: FetchDeployMetadataResult | undefined;

  if (ext.moduleVersion === "latest") {
    publishedModule = await fetchLatestPublishedContractVersion(
      publisherAddress,
      ext.moduleName,
      client,
    );
  } else {
    const allPublishedModules = await fetchPublishedContractVersions(
      publisherAddress,
      ext.moduleName,
      client,
    );

    publishedModule = allPublishedModules.find(
      (v) => v.version === ext.moduleVersion,
    );
  }

  invariant(
    publishedModule,
    `Module ${ext.moduleName} version "${ext.moduleVersion}" not found`,
  );

  invariant(publishedModule.abi, `ABI not found for module ${ext.moduleName}`);

  // get encodeBytesOnInstall function's install params

  const installParamsForModule =
    publishedModule.abi
      .filter((f) => f.type === "function")
      .find((f) => f.name === "encodeBytesOnInstall")?.inputs || [];

  return {
    moduleName: ext.moduleName,
    params: installParamsForModule,
  };
}
