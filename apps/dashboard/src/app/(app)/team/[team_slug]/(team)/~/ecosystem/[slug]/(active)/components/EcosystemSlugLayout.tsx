import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team";
import { TabPathLinks } from "@/components/ui/tabs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
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

      <TabPathLinks
        className="pt-2"
        links={[
          {
            exactMatch: true,
            name: "Overview",
            path: `${ecosystemLayoutPath}/${ecosystem.slug}`,
          },
          {
            name: "Analytics",
            path: `${ecosystemLayoutPath}/${ecosystem.slug}/analytics`,
          },
          {
            name: "Design (coming soon)",
            path: `${ecosystemLayoutPath}/${ecosystem.slug}/#`,
          },
        ]}
        scrollableClassName="container max-w-7xl"
      />
      <div className="container max-w-7xl flex flex-col grow pt-6 pb-10">
        {children}
      </div>
    </div>
  );
}
