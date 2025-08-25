import { notFound, redirect } from "next/navigation";
import { getValidAccount } from "@/api/account/get-account";
import { getMembers } from "@/api/team/team-members";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
    <div className="flex flex-col pb-20">
      {/* breadcrumb */}
      <div className="border-b border-dashed py-3">
        <Breadcrumb className="container max-w-7xl">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/team/${params.team_slug}/~/infrastructure/deploy`}
              >
                {" "}
                Deploy Infrastructure{" "}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{cleanChainName(chain.name)}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* header */}
      <div className="border-b py-10">
        <div className="container max-w-7xl">
          <div className="flex mb-4">
            <div className="p-2 rounded-full bg-card border">
              <ChainIconClient
                className="size-8"
                client={client}
                loading="lazy"
                src={chain.icon?.url}
              />
            </div>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight">
            Deploy Infrastructure on {cleanChainName(chain.name)}
          </h2>
        </div>
      </div>

      {/* form */}
      <div className="container max-w-7xl pt-8">
        <DeployInfrastructureForm
          chain={chain}
          isOwner={accountMemberInfo.role === "OWNER"}
          teamSlug={params.team_slug}
        />
      </div>
    </div>
  );
}

function cleanChainName(chainName: string) {
  return chainName.replace("Mainnet", "");
}
