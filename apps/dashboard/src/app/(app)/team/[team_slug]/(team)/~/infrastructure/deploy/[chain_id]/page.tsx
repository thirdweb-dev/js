import { ArrowUpDownIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getValidAccount } from "@/api/account/get-account";
import { getMembers } from "@/api/team/team-members";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { ChainIconClient } from "@/icons/ChainIcon";
import { getChain } from "../../../../../../../(dashboard)/(chain)/utils";
import { DeployInfrastructureForm } from "../_components/deploy-infrastructure-form.client";

export default async function DeployInfrastructureOnChainPage(props: {
  params: Promise<{ chain_id: string; team_slug: string }>;
}) {
  const params = await props.params;

  const pagePath = `/team/${params.team_slug}/~/infrastructure/deploy/${params.chain_id}`;

  const [account, chain, members] = await Promise.all([
    getValidAccount(pagePath),
    getChain(params.chain_id),
    getMembers(params.team_slug),
  ]);

  if (!chain) {
    notFound();
  }
  if (chain.slug !== params.chain_id) {
    // redirect to the slug version of the page
    redirect(`/team/${params.team_slug}/~/infrastructure/deploy/${chain.slug}`);
  }

  if (!members) {
    notFound();
  }

  const accountMemberInfo = members.find((m) => m.accountId === account.id);

  if (!accountMemberInfo) {
    notFound();
  }

  const client = getClientThirdwebClient();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Deploy Infrastructure on
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
            <Button
              asChild
              className="text-muted-foreground p-0 hover:text-foreground size-4"
              size="icon"
              variant="link"
            >
              <Link href={`/team/${params.team_slug}/~/infrastructure/deploy`}>
                <ArrowUpDownIcon className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <DeployInfrastructureForm
        chain={chain}
        isOwner={accountMemberInfo.role === "OWNER"}
        teamSlug={params.team_slug}
      />
    </div>
  );
}

function cleanChainName(chainName: string) {
  return chainName.replace("Mainnet", "");
}
