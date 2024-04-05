// ----------------------------
// COMMON
// ----------------------------

export type {
  DirectListing,
  ListingStatus,
} from "../../extensions/marketplace/types.js";

// ----------------------------
// DIRECT LISTINGS
// ----------------------------

// READ
export { totalListings } from "../../extensions/marketplace/__generated__/IDirectListings/read/totalListings.js";
export {
  getListing,
  type GetListingParams,
} from "../../extensions/marketplace/read/direct/getListing.js";
export {
  getAllListings,
  type GetAllListingParams,
} from "../../extensions/marketplace/read/direct/getAllListings.js";
export {
  getAllValidListings,
  type GetAllValidListingParams,
} from "../../extensions/marketplace/read/direct/getAllValidListings.js";

// WRITE
export {
  createListing,
  type CreateListingParams,
} from "../../extensions/marketplace/write/direct/createListing.js";

// EVENTS
export {
  buyerApprovedForListingEvent,
  type BuyerApprovedForListingEventFilters,
} from "../../extensions/marketplace/__generated__/IDirectListings/events/BuyerApprovedForListing.js";
export {
  cancelledListingEvent,
  type CancelledListingEventFilters,
} from "../../extensions/marketplace/__generated__/IDirectListings/events/CancelledListing.js";
export {
  currencyApprovedForListingEvent,
  type CurrencyApprovedForListingEventFilters,
} from "../../extensions/marketplace/__generated__/IDirectListings/events/CurrencyApprovedForListing.js";
export {
  newListingEvent,
  type NewListingEventFilters,
} from "../../extensions/marketplace/__generated__/IDirectListings/events/NewListing.js";
export {
  newSaleEvent,
  type NewSaleEventFilters,
} from "../../extensions/marketplace/__generated__/IDirectListings/events/NewSale.js";
export {
  updatedListingEvent,
  type UpdatedListingEventFilters,
} from "../../extensions/marketplace/__generated__/IDirectListings/events/UpdatedListing.js";

// ----------------------------
// ENGLISH AUCTIONS
// ----------------------------

// READ
export { totalAuctions } from "../../extensions/marketplace/__generated__/IEnglishAuctions/read/totalAuctions.js";
export {
  getAuction,
  type GetAuctionParams,
} from "../../extensions/marketplace/read/english-auction/getAuction.js";
export {
  getAllAuctions,
  type GetAllAuctionParams,
} from "../../extensions/marketplace/read/english-auction/getAllAuctions.js";
export {
  getAllValidAuctions,
  type GetAllValidAuctionParams,
} from "../../extensions/marketplace/read/english-auction/getAllValidAuctions.js";

// WRITE
export {
  createAuction,
  type CreateAuctionParams,
} from "../../extensions/marketplace/write/english-auction/createAuction.js";

// EVENTS
export {
  auctionClosedEvent,
  type AuctionClosedEventFilters,
} from "../../extensions/marketplace/__generated__/IEnglishAuctions/events/AuctionClosed.js";
export {
  cancelledAuctionEvent,
  type CancelledAuctionEventFilters,
} from "../../extensions/marketplace/__generated__/IEnglishAuctions/events/CancelledAuction.js";
export {
  newAuctionEvent,
  type NewAuctionEventFilters,
} from "../../extensions/marketplace/__generated__/IEnglishAuctions/events/NewAuction.js";
export {
  newBidEvent,
  type NewBidEventFilters,
} from "../../extensions/marketplace/__generated__/IEnglishAuctions/events/NewBid.js";
