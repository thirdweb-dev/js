import {
  isGetInstalledModulesSupported,
  isInstallModuleSupported,
} from "thirdweb/modules";

export function isModularCoreContract(functionSelectors: string[]) {
  return [
    isGetInstalledModulesSupported(functionSelectors),
    isInstallModuleSupported(functionSelectors),
  ].every(Boolean);
}
