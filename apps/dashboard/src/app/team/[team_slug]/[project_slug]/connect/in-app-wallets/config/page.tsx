import { getProject } from "@/api/projects";
import { getAPIKeyForProjectId } from "app/api/lib/getAPIKeys";
import { notFound } from "next/navigation";
import { InAppWalletSettingsPage } from "../../../../../../../components/embedded-wallets/Configure";
import { TRACKING_CATEGORY } from "../_constants";

export default async function Page({
  params,
}: { params: { team_slug: string; project_slug: string } }) {
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    notFound();
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
      />
    </>
  );
}
