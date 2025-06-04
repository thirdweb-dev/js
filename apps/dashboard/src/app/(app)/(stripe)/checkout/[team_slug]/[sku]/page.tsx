import type { ProductSKU } from "@/lib/billing";
import { redirect } from "next/navigation";
import { StripeRedirectErrorPage } from "../../../_components/StripeRedirectErrorPage";
import {
  getBillingCheckoutUrl,
  getCryptoTopupUrl,
  getInvoicePaymentUrl,
} from "../../../utils/billing";

export default async function CheckoutPage(props: {
  params: Promise<{
    team_slug: string;
    sku: string;
  }>;
  searchParams: Promise<{
    amount?: string;
    invoice_id?: string;
  }>;
}) {
  const params = await props.params;

  switch (params.sku) {
    case "topup": {
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
      break;
    }
    case "invoice": {
      const invoiceId = (await props.searchParams).invoice_id;
      if (!invoiceId) {
        return <StripeRedirectErrorPage errorMessage="Invalid invoice ID" />;
      }
      const invoice = await getInvoicePaymentUrl({
        teamSlug: params.team_slug,
        invoiceId,
      });
      if (!invoice) {
        return (
          <StripeRedirectErrorPage errorMessage="Failed to load invoice payment page" />
        );
      }
      redirect(invoice);
      break;
    }
    default: {
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
      break;
    }
  }

  return null;
}
