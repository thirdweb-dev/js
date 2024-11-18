import { getAuthToken } from "../../app/api/lib/getAuthToken";
import { API_SERVER_URL } from "../constants/env";

// keep in line with product SKUs in the backend
type ProductSKU =
  | "plan:starter"
  | "plan:growth"
  | "plan:custom"
  | "product:ecosystem_wallets"
  | "product:engine_standard"
  | "product:engine_premium"
  | "usage:storage"
  | "usage:in_app_wallet"
  | "usage:aa_sponsorship"
  | "usage:aa_sponsorship_op_grant"
  | null;

type InvoiceLine = {
  // amount for this line item
  amount: number;
  // statement descriptor
  description: string | null;
  // the thirdweb product sku or null if it is not recognized
  thirdwebSku: ProductSKU | null;
};

type Invoice = {
  // total amount excluding tax
  amount: number | null;
  // the ISO currency code (e.g. USD)
  currency: string;
  // the line items on the invoice
  lines: InvoiceLine[];
};

export type TeamSubscription = {
  id: string;
  type: "PLAN" | "USAGE" | "PLAN_ADD_ON" | "PRODUCT";
  status:
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "paused";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart: string | null;
  trialEnd: string | null;
  upcomingInvoice: Invoice;
};

export async function getTeamSubscriptions(slug: string) {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const teamRes = await fetch(
    `${API_SERVER_URL}/v1/teams/${slug}/subscriptions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (teamRes.ok) {
    return (await teamRes.json())?.result as TeamSubscription[];
  }
  return null;
}

// util fn:

export function parseThirdwebSKU(sku: ProductSKU) {
  if (!sku) {
    return null;
  }
  switch (sku) {
    case "plan:starter":
      return "Starter Plan";
    case "plan:growth":
      return "Growth Plan";
    case "plan:custom":
      return "Custom Plan";
    case "product:ecosystem_wallets":
      return "Ecosystem Wallets";
    case "product:engine_standard":
      return "Engine Standard";
    case "product:engine_premium":
      return "Engine Premium";
    case "usage:storage":
      return "Storage";
    case "usage:in_app_wallet":
      return "In-App Wallet";
    case "usage:aa_sponsorship":
      return "AA Sponsorship";
    case "usage:aa_sponsorship_op_grant":
      return "AA Sponsorship Op Grant";
    default:
      return null;
  }
}
