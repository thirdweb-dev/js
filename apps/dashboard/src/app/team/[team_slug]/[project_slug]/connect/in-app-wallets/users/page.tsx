import { getProject } from "@/api/projects";
import { InAppWalletUsersPageContent } from "components/embedded-wallets/Users";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../login/loginRedirect";
import { TRACKING_CATEGORY } from "../_constants";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/connect/in-app-wallets/users`,
    );
  }

  if (!project) {
    redirect("/team");
  }

  return (
    <>
      <InAppWalletUsersPageContent
        clientId={project.publishableKey}
        trackingCategory={TRACKING_CATEGORY}
        authToken={authToken}
      />
    </>
  );
}
