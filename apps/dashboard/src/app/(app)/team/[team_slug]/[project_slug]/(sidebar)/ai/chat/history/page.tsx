import { notFound } from "next/navigation";
import { getProject } from "@/api/project/projects";
import { getSessions } from "../../api/session";
import { ChatHistoryPage } from "./ChatHistoryPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const [params] = await Promise.all([props.params]);

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    notFound();
  }

  const sessions = await getSessions({ project }).catch(() => []);
  return (
    <ChatHistoryPage
      sessions={sessions}
      project={project}
      team_slug={params.team_slug}
    />
  );
}
