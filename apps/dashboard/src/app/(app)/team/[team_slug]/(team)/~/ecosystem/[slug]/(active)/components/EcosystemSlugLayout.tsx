import { redirect } from "next/navigation";
import { getTeamBySlug } from "@/api/team";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "../../../../../../../../../../@/api/auth-token";
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
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex grow flex-col">
      <EcosystemHeader
        authToken={authToken}
        client={client}
        ecosystem={ecosystem}
        ecosystemLayoutPath={ecosystemLayoutPath}
        teamId={team.id}
        teamIdOrSlug={params.team_slug}
      />

      <SidebarLayout
        sidebarLinks={[
          {
            exactMatch: true,
            href: `${ecosystemLayoutPath}/${ecosystem.slug}`,
            label: "Overview",
          },
          {
            href: `${ecosystemLayoutPath}/${ecosystem.slug}/analytics`,
            label: "Analytics",
          },
          {
            href: `${ecosystemLayoutPath}/${ecosystem.slug}#`,
            label: "Design (coming soon)",
          },
        ]}
      >
        {children}
      </SidebarLayout>
    </div>
  );
}
