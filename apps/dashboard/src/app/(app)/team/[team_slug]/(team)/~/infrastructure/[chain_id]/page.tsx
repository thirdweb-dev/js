import { InfoIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getChainSubscriptionForChain } from "@/api/team/team-subscription";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { ChainIconClient } from "@/icons/ChainIcon";
import { formatToDollars } from "@/utils/formatToDollars";
import { getChain } from "../../../../../../(dashboard)/(chain)/utils";
import { InfraServiceCard } from "./_components/service-card";

const PRODUCTS = [
  {
    sku: "chain:infra:rpc",
    title: "RPC",
  },
  {
    sku: "chain:infra:insight",
    title: "Insight",
  },
  {
    sku: "chain:infra:account_abstraction",
    title: "Account Abstraction",
  },
] as const;

export default async function DeployInfrastructureOnChainPage(props: {
  params: Promise<{ chain_id: string; team_slug: string }>;
}) {
  const params = await props.params;
  const chain = await getChain(params.chain_id);

  if (!chain) {
    notFound();
  }
  if (chain.slug !== params.chain_id) {
    // redirect to the slug version of the page
    redirect(`/team/${params.team_slug}/~/infrastructure/${chain.slug}`);
  }

  const chainSubscription = await getChainSubscriptionForChain(
    params.team_slug,
    chain.chainId,
  );

  if (!chainSubscription) {
    notFound();
  }

  const client = getClientThirdwebClient();

  // Format renewal date and amount due for the subscription summary section
  const renewalDate = new Date(chainSubscription.currentPeriodEnd);
  const formattedRenewalDate = renewalDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // upcomingInvoice.amount is stored in cents – format to dollars if available
  const formattedAmountDue =
    chainSubscription.upcomingInvoice.amount !== null
      ? formatToDollars(chainSubscription.upcomingInvoice.amount)
      : "N/A";

  return (
    <div className="flex flex-col gap-8">
      {/* Chain header */}
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Infrastructure for
        </h2>
        <Card>
          <CardContent className="flex gap-4 items-center p-4">
            <span className="flex gap-2 truncate text-left items-center">
              {chain.icon && (
                <ChainIconClient
                  className="size-6"
                  client={client}
                  loading="lazy"
                  src={chain.icon?.url}
                />
              )}
              {cleanChainName(chain.name)}
            </span>

            <Badge className="gap-2" variant="outline">
              <span className="text-muted-foreground">Chain ID</span>
              {chain.chainId}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {PRODUCTS.map((product) => {
        const hasSku = chainSubscription.skus.includes(product.sku);

        // Map sku to chain service key
        const skuToServiceKey: Record<string, string> = {
          "chain:infra:account_abstraction": "account-abstraction",
          "chain:infra:insight": "insight",
          "chain:infra:rpc": "rpc-edge",
        };

        const serviceKey = skuToServiceKey[product.sku];
        const chainService = chain.services.find(
          (s) => s.service === serviceKey,
        );
        const serviceEnabled =
          chainService?.enabled ?? chainService?.status === "enabled";

        let status: "active" | "pending" | "inactive";
        if (hasSku && serviceEnabled) {
          status = "active";
        } else if (hasSku && !serviceEnabled) {
          status = "pending";
        } else {
          status = "inactive";
        }

        return (
          <InfraServiceCard
            key={product.sku}
            status={status}
            title={product.title}
          />
        );
      })}

      <Separator />
      {/* Subscription summary */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          {/* Left: header + info */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <h3 className="text-lg font-semibold">Subscription details </h3>
              {chainSubscription.isLegacy && (
                <Badge className="gap-0.5" variant="outline">
                  <span>Enterprise</span>
                  <ToolTipLabel
                    label={
                      <span className="text-xs font-normal">
                        This subscription is part of an enterprise agreement and
                        cannot be modified through the dashboard. Please contact
                        your account executive for any modifications.
                      </span>
                    }
                  >
                    <InfoIcon className="size-3 ml-1 cursor-help" />
                  </ToolTipLabel>
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="flex gap-2 items-center">
                <span className="text-muted-foreground">Renews on</span>
                <span>{formattedRenewalDate}</span>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-muted-foreground">Amount due</span>
                <span>{formattedAmountDue}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cleanChainName(chainName: string) {
  return chainName.replace("Mainnet", "");
}
