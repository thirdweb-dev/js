import { getProject } from "@/api/projects";
import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { notFound } from "next/navigation";
import { AccountAbstractionSettingsPage } from "../../../../../../components/smart-wallets/SponsorshipPolicies";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { getAPIKeyForProjectId } from "../../../../../api/lib/getAPIKeys";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [account, project] = await Promise.all([
    getValidAccount(),
    getProject(team_slug, project_slug),
  ]);

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
        twAccount={account}
      />
    </ChakraProviderSetup>
  );
}
