//
// COMMON
//
export type {
  DirectListing,
  ListingStatus,
} from "../../extensions/marketplace/types.js";

//
// DIRECT LISTINGS
//

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
} from "../../extensions/marketplace/__generated__/IDirectListings/write/createListing.js";

//
// ENGLISH AUCTIONS
//

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
} from "../../extensions/marketplace/__generated__/IEnglishAuctions/write/createAuction.js";
