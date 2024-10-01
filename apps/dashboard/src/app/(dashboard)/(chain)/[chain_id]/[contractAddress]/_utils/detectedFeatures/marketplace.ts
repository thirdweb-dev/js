import * as MarketplaceExt from "thirdweb/extensions/marketplace";

export function isDirectListingSupported(functionSelectors: string[]) {
  return [
    MarketplaceExt.isCreateListingSupported(functionSelectors),
    MarketplaceExt.isCancelListingSupported(functionSelectors),
    MarketplaceExt.isBuyFromListingSupported(functionSelectors),
  ].every(Boolean);
}

export function isEnglishAuctionSupported(functionSelectors: string[]) {
  return [
    MarketplaceExt.isCreateAuctionSupported(functionSelectors),
    MarketplaceExt.isCancelAuctionSupported(functionSelectors),
    MarketplaceExt.isBidInAuctionSupported(functionSelectors),
  ].every(Boolean);
}
