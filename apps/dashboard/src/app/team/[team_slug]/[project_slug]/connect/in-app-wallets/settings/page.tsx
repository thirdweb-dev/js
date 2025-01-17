import { getProject } from "@/api/projects";
import { notFound, redirect } from "next/navigation";
import { InAppWalletSettingsPage } from "../../../../../../../components/embedded-wallets/Configure";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { getAPIKeyForProjectId } from "../../../../../../api/lib/getAPIKeys";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [account, project] = await Promise.all([
    getValidAccount(),
    getProject(team_slug, project_slug),
  ]);

  if (!project) {
    redirect("/team");
  }

  const apiKey = await getAPIKeyForProjectId(project.id);

  if (!apiKey) {
    // unexpected error - this should never happen
    notFound();
  }

  return (
    <InAppWalletSettingsPage
      apiKey={apiKey}
      twAccount={account}
      trackingCategory="in-app-wallet-project-settings"
    />
  );
}
