import { getProject } from "@/api/projects";
import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { notFound } from "next/navigation";
import { AccountAbstractionSettingsPage } from "../../../../../../components/smart-wallets/SponsorshipPolicies";
import { getAPIKeyForProjectId } from "../../../../../api/lib/getAPIKeys";

export default async function Page(props: {
  params: { team_slug: string; project_slug: string };
}) {
  const { team_slug, project_slug } = props.params;
  const project = await getProject(team_slug, project_slug);

  if (!project) {
    notFound();
  }

  const apiKey = await getAPIKeyForProjectId(project.id);

  if (!apiKey) {
    notFound();
  }

  return (
    <ChakraProviderSetup>
      <AccountAbstractionSettingsPage
        apiKeyServices={apiKey.services || []}
        trackingCategory="account-abstraction-project-settings"
      />
    </ChakraProviderSetup>
  );
}
