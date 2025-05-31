import type { ProductSKU } from "@/lib/billing";
import { redirect } from "next/navigation";
import { StripeRedirectErrorPage } from "../../../_components/StripeRedirectErrorPage";
import {
  getBillingCheckoutUrl,
  getCryptoTopupUrl,
} from "../../../utils/billing";

export default async function CheckoutPage(props: {
  params: Promise<{
    team_slug: string;
    sku: string;
  }>;
  searchParams: Promise<{
    amount?: string;
  }>;
}) {
  const params = await props.params;

  // special case for crypto topup
  if (params.sku === "topup") {
    const amountUSD = Number.parseInt(
      (await props.searchParams).amount || "10",
    );
    if (Number.isNaN(amountUSD)) {
      return <StripeRedirectErrorPage errorMessage="Invalid amount" />;
    }
    const topupUrl = await getCryptoTopupUrl({
      teamSlug: params.team_slug,
      amountUSD,
    });
    if (!topupUrl) {
      // TODO: make a better error page
      return (
        <StripeRedirectErrorPage errorMessage="Failed to load topup page" />
      );
    }
    redirect(topupUrl);
    return null;
  }

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
