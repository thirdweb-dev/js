import { getProject } from "@/api/projects";
import { InAppWalletUsersPageContent } from "components/embedded-wallets/Users";
import { notFound } from "next/navigation";
import { TRACKING_CATEGORY } from "../_constants";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);
  if (!project) {
    notFound();
  }

  return (
    <>
      <InAppWalletUsersPageContent
        clientId={project.publishableKey}
        trackingCategory={TRACKING_CATEGORY}
      />
    </>
  );
}
