// FIXME: export listing status type
import type { ListingStatus } from "thirdweb/dist/types/extensions/marketplace/types";

export const LISTING_STATUS: Record<ListingStatus, string> = {
  UNSET: "Does not exist",
  CREATED: "Created",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ACTIVE: "Active",
  EXPIRED: "Expired",
};
