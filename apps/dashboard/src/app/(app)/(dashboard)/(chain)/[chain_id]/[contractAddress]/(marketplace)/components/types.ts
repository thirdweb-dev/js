// FIXME: export listing status type
import type { ListingStatus } from "thirdweb/dist/types/extensions/marketplace/types";

export const LISTING_STATUS: Record<ListingStatus, string> = {
  ACTIVE: "Active",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  CREATED: "Created",
  EXPIRED: "Expired",
  UNSET: "Does not exist",
};
