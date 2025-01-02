import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";

export function isERC721ClaimConditionsSupported(functionSelectors: string[]) {
  return [
    // reads
    ERC721Ext.isGetClaimConditionByIdSupported(functionSelectors),
    ERC721Ext.isGetActiveClaimConditionIdSupported(functionSelectors),
    ERC721Ext.isGetClaimConditionsSupported(functionSelectors),
    ERC721Ext.isGetActiveClaimConditionSupported(functionSelectors),
    // writes
    ERC721Ext.isSetClaimConditionsSupported(functionSelectors),
    ERC721Ext.isResetClaimEligibilitySupported(functionSelectors),
  ].every(Boolean);
}

export function isERC20ClaimConditionsSupported(functionSelectors: string[]) {
  return [
    // reads
    ERC20Ext.isGetClaimConditionByIdSupported(functionSelectors),
    ERC20Ext.isGetActiveClaimConditionIdSupported(functionSelectors),
    ERC20Ext.isGetClaimConditionsSupported(functionSelectors),
    ERC20Ext.isGetActiveClaimConditionSupported(functionSelectors),
    // writes
    ERC20Ext.isSetClaimConditionsSupported(functionSelectors),
    ERC20Ext.isResetClaimEligibilitySupported(functionSelectors),
  ].every(Boolean);
}

function isERC1155ClaimConditionsSupported(functionSelectors: string[]) {
  return [
    // reads
    ERC1155Ext.isGetClaimConditionByIdSupported(functionSelectors),
    ERC1155Ext.isGetClaimConditionsSupported(functionSelectors),
    ERC1155Ext.isGetActiveClaimConditionSupported(functionSelectors),
    // writes
    ERC1155Ext.isSetClaimConditionsSupported(functionSelectors),
    ERC1155Ext.isResetClaimEligibilitySupported(functionSelectors),
  ].every(Boolean);
}

export function isClaimConditionsSupported(functionSelectors: string[]) {
  return (
    isERC721ClaimConditionsSupported(functionSelectors) ||
    isERC20ClaimConditionsSupported(functionSelectors) ||
    isERC1155ClaimConditionsSupported(functionSelectors)
  );
}
