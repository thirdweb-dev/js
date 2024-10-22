import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { InAppWalletSettingsPage } from "../../../../../../components/embedded-wallets/Configure";
import { getAPIKeyForProjectId } from "../../../../../api/lib/getAPIKeys";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = (await props.params);
  const project = await getProject(team_slug, project_slug);

  if (!project) {
    notFound();
  }

  const apiKey = await getAPIKeyForProjectId(project.id);

  if (!apiKey) {
    notFound();
  }

  return (
    <InAppWalletSettingsPage
      apiKey={apiKey}
      trackingCategory="in-app-wallet-project-settings"
    />
  );
}
