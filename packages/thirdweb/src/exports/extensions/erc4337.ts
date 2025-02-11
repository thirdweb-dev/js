// ACCOUNT
export { isValidateUserOpSupported } from "../../extensions/erc4337/__generated__/IAccount/write/validateUserOp.js";
export {
  type AddAdminOptions,
  addAdmin,
  isAddAdminSupported,
} from "../../extensions/erc4337/account/addAdmin.js";

export {
  type RemoveAdminOptions,
  removeAdmin,
  isRemoveAdminSupported,
} from "../../extensions/erc4337/account/removeAdmin.js";

export {
  type AddSessionKeyOptions,
  addSessionKey,
  isAddSessionKeySupported,
  shouldUpdateSessionKey,
} from "../../extensions/erc4337/account/addSessionKey.js";

export {
  type RemoveSessionKeyOptions,
  removeSessionKey,
  isRemoveSessionKeySupported,
} from "../../extensions/erc4337/account/removeSessionKey.js";

export {
  isAccountDeployed,
  type IsAccountDeployedParams,
  isIsAccountDeployedSupported,
} from "../../extensions/erc4337/account/isAccountDeployed.js";

export {
  createAccount,
  type CreateAccountParams,
  isCreateAccountSupported,
} from "../../extensions/erc4337/__generated__/IAccountFactory/write/createAccount.js";

export {
  getAllActiveSigners,
  isGetAllActiveSignersSupported,
} from "../../extensions/erc4337/__generated__/IAccountPermissions/read/getAllActiveSigners.js";
export {
  getAllAdmins,
  isGetAllAdminsSupported,
} from "../../extensions/erc4337/__generated__/IAccountPermissions/read/getAllAdmins.js";
export {
  getAllSigners,
  isGetAllSignersSupported,
} from "../../extensions/erc4337/__generated__/IAccountPermissions/read/getAllSigners.js";
export {
  getPermissionsForSigner,
  type GetPermissionsForSignerParams,
} from "../../extensions/erc4337/__generated__/IAccountPermissions/read/getPermissionsForSigner.js";
export {
  isActiveSigner,
  isIsActiveSignerSupported,
  type IsActiveSignerParams,
} from "../../extensions/erc4337/__generated__/IAccountPermissions/read/isActiveSigner.js";
export {
  isAdmin,
  isIsAdminSupported,
} from "../../extensions/erc4337/__generated__/IAccountPermissions/read/isAdmin.js";
export { adminUpdatedEvent } from "../../extensions/erc4337/__generated__/IAccountPermissions/events/AdminUpdated.js";
export { signerPermissionsUpdatedEvent } from "../../extensions/erc4337/__generated__/IAccountPermissions/events/SignerPermissionsUpdated.js";

// FACTORY
export {
  getAllAccounts,
  isGetAllAccountsSupported,
} from "../../extensions/erc4337/__generated__/IAccountFactory/read/getAllAccounts.js";
export {
  getAccounts,
  isGetAccountsSupported,
} from "../../extensions/erc4337/__generated__/IAccountFactory/read/getAccounts.js";
export {
  totalAccounts,
  isTotalAccountsSupported,
} from "../../extensions/erc4337/__generated__/IAccountFactory/read/totalAccounts.js";
export { isRegistered } from "../../extensions/erc4337/__generated__/IAccountFactory/read/isRegistered.js";
export {
  getAccountsOfSigner,
  type GetAccountsOfSignerParams,
  isGetAccountsOfSignerSupported,
} from "../../extensions/erc4337/__generated__/IAccountFactory/read/getAccountsOfSigner.js";
export {
  getAddress as predictAccountAddress,
  type GetAddressParams as PredictAccountAddressParams,
  isGetAddressSupported as isPredictAccountAddressSupported,
} from "../../extensions/erc4337/__generated__/IAccountFactory/read/getAddress.js";

// ENTRYPOINT

export { accountDeployedEvent } from "../../extensions/erc4337/__generated__/IEntryPoint/events/AccountDeployed.js";
export { userOperationEventEvent } from "../../extensions/erc4337/__generated__/IEntryPoint/events/UserOperationEvent.js";
export { userOperationRevertReasonEvent } from "../../extensions/erc4337/__generated__/IEntryPoint/events/UserOperationRevertReason.js";
export {
  getUserOpHash,
  type GetUserOpHashParams,
} from "../../extensions/erc4337/__generated__/IEntryPoint/read/getUserOpHash.js";
export {
  simulateHandleOp,
  type SimulateHandleOpParams,
} from "../../extensions/erc4337/__generated__/IEntryPoint/write/simulateHandleOp.js";
