import { getProject } from "@/api/projects";
import { getAPIKeyForProjectId } from "app/api/lib/getAPIKeys";
import { notFound, redirect } from "next/navigation";
import { InAppWalletSettingsPage } from "../../../../../../../components/embedded-wallets/Configure";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { TRACKING_CATEGORY } from "../_constants";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const [account, project] = await Promise.all([
    getValidAccount(
      `/${params.team_slug}/${params.project_slug}/connect/in-app-wallets/config`,
    ),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!project) {
    redirect("/team");
  }

  const apiKey = await getAPIKeyForProjectId(project.id);

  if (!apiKey) {
    notFound();
  }

  return (
    <>
      <InAppWalletSettingsPage
        apiKey={apiKey}
        trackingCategory={TRACKING_CATEGORY}
        twAccount={account}
      />
    </>
  );
}
