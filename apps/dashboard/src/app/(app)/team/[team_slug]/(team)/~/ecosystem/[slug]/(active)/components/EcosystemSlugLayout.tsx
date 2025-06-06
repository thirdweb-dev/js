import { getTeamBySlug } from "@/api/team";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../../../../../../api/lib/getAuthToken";
import { fetchEcosystem } from "../../../utils/fetchEcosystem";
import { EcosystemHeader } from "./ecosystem-header.client";

export async function EcosystemLayoutSlug({
  children,
  params,
  ecosystemLayoutPath,
}: {
  children: React.ReactNode;
  params: { slug: string; team_slug: string };
  ecosystemLayoutPath: string;
}) {
  const authToken = await getAuthToken();

  if (!authToken) {
    redirect(ecosystemLayoutPath);
  }

  const ecosystem = await fetchEcosystem(
    params.slug,
    authToken,
    params.team_slug,
  );

  // Fetch team details to obtain team ID for further authenticated updates
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect(ecosystemLayoutPath);
  }

  if (!ecosystem) {
    redirect(ecosystemLayoutPath);
  }

  const client = getClientThirdwebClient({
    teamId: team.id,
    jwt: authToken,
  });

  return (
    <div className="flex grow flex-col">
      <EcosystemHeader
        client={client}
        ecosystem={ecosystem}
        ecosystemLayoutPath={ecosystemLayoutPath}
        teamIdOrSlug={params.team_slug}
        authToken={authToken}
        teamId={team.id}
      />

      <SidebarLayout
        sidebarLinks={[
          {
            label: "Overview",
            href: `${ecosystemLayoutPath}/${ecosystem.slug}`,
            exactMatch: true,
          },
          {
            label: "Analytics",
            href: `${ecosystemLayoutPath}/${ecosystem.slug}/analytics`,
          },
          {
            label: "Design (coming soon)",
            href: `${ecosystemLayoutPath}/${ecosystem.slug}#`,
          },
        ]}
      >
        {children}
      </SidebarLayout>
    </div>
  );
}
