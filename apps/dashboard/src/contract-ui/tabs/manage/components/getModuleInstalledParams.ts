import { getThirdwebClient } from "@/constants/thirdweb.server";
import { fetchPublishedContractVersions } from "components/contract-components/fetch-contracts-with-versions";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import invariant from "tiny-invariant";
import type { ModuleMeta } from "./install-module-params";

export async function getModuleInstalledParams(ext: ModuleMeta) {
  // get all versions of the module
  // if the publisher is an ens name, resolve it
  const publisherAddress = isAddress(ext.publisherAddress)
    ? ext.publisherAddress
    : await resolveAddress({
        client: getThirdwebClient(),
        name: ext.publisherAddress,
      });
  const allPublishedModules = await fetchPublishedContractVersions(
    publisherAddress,
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
