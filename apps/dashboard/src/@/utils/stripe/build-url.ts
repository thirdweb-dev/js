import type { ProductSKU } from "@/types/billing";

export function buildCheckoutUrl(options: {
  sku: Exclude<ProductSKU, null>;
  teamSlug: string;
}) {
  return `/checkout/${options.teamSlug}/${options.sku}`;
}

export function buildCancelPlanUrl(options: { teamId: string }) {
  return `/cancel-plan/${options.teamId}`;
}

export function buildBillingPortalUrl(options: { teamSlug: string }) {
  return `/manage-billing/${options.teamSlug}`;
}
