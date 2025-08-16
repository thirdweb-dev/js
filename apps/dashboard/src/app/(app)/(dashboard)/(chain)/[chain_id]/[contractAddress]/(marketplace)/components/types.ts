import type { ListingStatus } from "thirdweb/extensions/marketplace";

export const LISTING_STATUS: Record<ListingStatus, string> = {
  ACTIVE: "Active",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  CREATED: "Created",
  EXPIRED: "Expired",
  UNSET: "Does not exist",
};
