import * as ERC4337Ext from "thirdweb/extensions/erc4337";

export function isAccountFactoryContract(functionSelectors: string[]) {
  return [
    ERC4337Ext.isGetAllAccountsSupported(functionSelectors),
    ERC4337Ext.isGetAccountsSupported(functionSelectors),
    ERC4337Ext.isTotalAccountsSupported(functionSelectors),
    ERC4337Ext.isGetAccountsOfSignerSupported(functionSelectors),
    ERC4337Ext.isPredictAccountAddressSupported(functionSelectors),
  ].every(Boolean);
}

export function isAccountContract(functionSelectors: string[]) {
  return ERC4337Ext.isValidateUserOpSupported(functionSelectors);
}

export function isAccountPermissionsSupported(functionSelectors: string[]) {
  return [
    ERC4337Ext.isGetAllActiveSignersSupported(functionSelectors),
    ERC4337Ext.isGetAllAdminsSupported(functionSelectors),
    ERC4337Ext.isGetAllSignersSupported(functionSelectors),
    ERC4337Ext.isIsActiveSignerSupported(functionSelectors),
    ERC4337Ext.isIsAdminSupported(functionSelectors),
    ERC4337Ext.isAddAdminSupported(functionSelectors),
  ].every(Boolean);
}
