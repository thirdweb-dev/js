import { SidebarLayout } from "@/components/blocks/SidebarLayout";
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

  if (!ecosystem) {
    redirect(ecosystemLayoutPath);
  }

  return (
    <div className="flex grow flex-col">
      <EcosystemHeader
        ecosystem={ecosystem}
        ecosystemLayoutPath={ecosystemLayoutPath}
        teamIdOrSlug={params.team_slug}
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
