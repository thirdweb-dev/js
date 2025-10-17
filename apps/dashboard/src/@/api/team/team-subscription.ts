import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { ChainInfraSKU, ProductSKU } from "@/types/billing";

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
  type: "PLAN" | "USAGE" | "PLAN_ADD_ON" | "PRODUCT" | "CHAIN";
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
  skus: (ProductSKU | ChainInfraSKU)[];
};

type ChainTeamSubscription = Omit<TeamSubscription, "skus"> & {
  chainId: string;
  skus: ChainInfraSKU[];
  isLegacy: boolean;
};

export async function getTeamSubscriptions(slug: string) {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const teamRes = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${slug}/subscriptions`,
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

const CHAIN_PLAN_TO_INFRA = {
  "chain:plan:gold": ["chain:infra:rpc", "chain:infra:account_abstraction"],
  "chain:plan:platinum": [
    "chain:infra:rpc",
    "chain:infra:insight",
    "chain:infra:account_abstraction",
  ],
  "chain:plan:ultimate": [
    "chain:infra:rpc",
    "chain:infra:insight",
    "chain:infra:account_abstraction",
  ],
};

async function getChainSubscriptions(slug: string) {
  const allSubscriptions = await getTeamSubscriptions(slug);
  if (!allSubscriptions) {
    return null;
  }

  // first replace any sku that MIGHT match a chain plan
  const updatedSubscriptions = allSubscriptions
    .filter((s) => s.type === "CHAIN")
    .map((s) => {
      const skus = s.skus;
      const updatedSkus = skus.flatMap((sku) => {
        const plan =
          CHAIN_PLAN_TO_INFRA[sku as keyof typeof CHAIN_PLAN_TO_INFRA];
        return plan ? plan : sku;
      });
      return {
        ...s,
        isLegacy: updatedSkus.length !== skus.length,
        skus: updatedSkus,
      };
    });

  return updatedSubscriptions.filter(
    (s): s is ChainTeamSubscription =>
      "chainId" in s && typeof s.chainId === "string",
  );
}

export async function getChainSubscriptionForChain(
  slug: string,
  chainId: number,
) {
  const chainSubscriptions = await getChainSubscriptions(slug);

  if (!chainSubscriptions) {
    return null;
  }

  return (
    chainSubscriptions.find((s) => s.chainId === chainId.toString()) ?? null
  );
}
