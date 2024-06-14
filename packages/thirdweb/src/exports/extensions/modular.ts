/**
 * READ
 */
export {
  getInstalledExtensions,
  isGetInstalledExtensionsSupported,
} from "../../extensions/modular/__generated__/ModularCore/read/getInstalledExtensions.js";
export {
  getSupportedCallbackFunctions,
  isGetSupportedCallbackFunctionsSupported,
} from "../../extensions/modular/__generated__/ModularCore/read/getSupportedCallbackFunctions.js";
export {
  hasAnyRole,
  type HasAnyRoleParams,
} from "../../extensions/modular/__generated__/ModularCore/read/hasAnyRole.js";
export {
  hasAllRoles,
  type HasAllRolesParams,
} from "../../extensions/modular/__generated__/ModularCore/read/hasAllRoles.js";
export { owner } from "../../extensions/modular/__generated__/ModularCore/read/owner.js";
export {
  ownershipHandoverExpiresAt,
  type OwnershipHandoverExpiresAtParams,
} from "../../extensions/modular/__generated__/ModularCore/read/ownershipHandoverExpiresAt.js";
export {
  rolesOf,
  type RolesOfParams,
} from "../../extensions/modular/__generated__/ModularCore/read/rolesOf.js";

/**
 * Write
 */
export { cancelOwnershipHandover } from "../../extensions/modular/__generated__/ModularCore/write/cancelOwnershipHandover.js";
export {
  completeOwnershipHandover,
  type CompleteOwnershipHandoverParams,
} from "../../extensions/modular/__generated__/ModularCore/write/completeOwnershipHandover.js";
export {
  grantRoles,
  type GrantRolesParams,
} from "../../extensions/modular/__generated__/ModularCore/write/grantRoles.js";
export {
  installExtension,
  isInstallExtensionSupported,
  type InstallExtensionParams,
} from "../../extensions/modular/__generated__/ModularCore/write/installExtension.js";
export { renounceOwnership } from "../../extensions/modular/__generated__/ModularCore/write/renounceOwnership.js";
export { requestOwnershipHandover } from "../../extensions/modular/__generated__/ModularCore/write/requestOwnershipHandover.js";
export {
  renounceRoles,
  type RenounceRolesParams,
} from "../../extensions/modular/__generated__/ModularCore/write/renounceRoles.js";
export {
  revokeRoles,
  type RevokeRolesParams,
} from "../../extensions/modular/__generated__/ModularCore/write/revokeRoles.js";
export {
  transferOwnership,
  type TransferOwnershipParams,
} from "../../extensions/modular/__generated__/ModularCore/write/transferOwnership.js";
export {
  uninstallExtension,
  isUninstallExtensionSupported,
  type UninstallExtensionParams,
} from "../../extensions/modular/__generated__/ModularCore/write/uninstallExtension.js";
export { getExtensionConfig } from "../../extensions/modular/__generated__/ModularExtension/read/getExtensionConfig.js";
export {
  installPublishedExtension,
  type InstallPublishedExtensionOptions,
} from "../../extensions/modular/ModularCore/write/installPublishedExtension.js";
export {
  uninstallPublishedExtension,
  type UninstallPublishedExtensionOptions,
} from "../../extensions/modular/ModularCore/write/uninstallPublishedExtension.js";
export {
  uninstallExtensionByProxy,
  type UninstallExtensionByProxyOptions,
} from "../../extensions/modular/ModularCore/write/uninstallExtensionByProxy.js";
