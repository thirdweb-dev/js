import type { ProductSKU } from "@/lib/billing";
import { redirect } from "next/navigation";
import { StripeRedirectErrorPage } from "../../../_components/StripeRedirectErrorPage";
import { getBillingCheckoutUrl } from "../../../utils/billing";

export default async function CheckoutPage(props: {
  params: Promise<{
    team_slug: string;
    sku: string;
  }>;
}) {
  const params = await props.params;

  const billingUrl = await getBillingCheckoutUrl({
    teamSlug: params.team_slug,
    sku: decodeURIComponent(params.sku) as Exclude<ProductSKU, null>,
  });

  if (!billingUrl) {
    return (
      <StripeRedirectErrorPage errorMessage="Failed to load checkout page" />
    );
  }

  redirect(billingUrl);

  return null;
}
