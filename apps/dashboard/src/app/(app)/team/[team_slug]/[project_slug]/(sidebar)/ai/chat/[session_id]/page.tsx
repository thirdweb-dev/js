import { notFound, redirect } from "next/navigation";
import { getAuthToken, getUserThirdwebClient } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getSessionById, getSessions } from "../../api/session";
import { ChatPageContent } from "../../components/ChatPageContent";
import { ChatPageLayout } from "../../components/ChatPageLayout";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
    session_id: string;
  }>;
}) {
  const [params] = await Promise.all([props.params]);
  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    notFound();
  }

  if (!project) {
    notFound();
  }

  const client = await getUserThirdwebClient({ teamId: project.teamId });

  const [session, sessions] = await Promise.all([
    getSessionById({
      project: project,
      sessionId: params.session_id,
    }).catch(() => undefined),
    getSessions({
      project: project,
    }).catch(() => []),
  ]);

  if (!session) {
    redirect(`/team/${params.team_slug}/${params.project_slug}/ai`);
  }

  return (
    <ChatPageLayout
      team_slug={params.team_slug}
      project={project}
      authToken={authToken}
      client={client}
      accountAddress={""}
      sessions={sessions}
    >
      <ChatPageContent
        project={project}
        accountAddress={""}
        authToken={authToken}
        client={client}
        initialParams={undefined}
        session={session}
        type="new-chat"
      />
    </ChatPageLayout>
  );
}
