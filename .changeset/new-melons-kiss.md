---
"thirdweb": patch
---

---

## Marketplace Extensions

Added initial support for the Marketplace extensions, available via the `thirdweb/extensions/marketplace` module.

### Direct Listings

#### Write

- `createListing`

#### Read

- `totalListings`
- `getListing`
- `getAllListings`
- `getAllValidListings`

#### Events

- `buyerApprovedForListingEvent`
- `cancelledListingEvent`
- `currencyApprovedForListingEvent`
- `newListingEvent`
- `newSaleEvent`
- `updatedListingEvent`

### English Auctions

#### Write

- `createAuction`

#### Read

- `totalAuctions`
- `getAuction`
- `getAllAuctions`
- `getAllValidAuctions`

#### Events

- `auctionClosedEvent`
- `cancelledAuctionEvent`
- `newAuctionEvent`
- `newBidEvent`

### Types

- `DirectListing`
- `EnglishAuction`

## ERC721 Extensions

- Added `isERC721` to the `thirdweb/extensions/erc721` module.

## ERC1155 Extensions

- Added `isERC1155` to the `thirdweb/extensions/erc1155` module.
