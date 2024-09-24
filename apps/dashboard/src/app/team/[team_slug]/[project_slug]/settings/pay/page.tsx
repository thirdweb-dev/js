import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { PayConfig } from "../../../../../../components/pay/PayConfig";
import { getAPIKey } from "../../../../../api/lib/getAPIKeys";

export default async function Page(props: {
  params: {
    team_slug: string;
    project_slug: string;
  };
}) {
  const { team_slug, project_slug } = props.params;
  const project = await getProject(team_slug, project_slug);

  if (!project) {
    notFound();
  }

  // THIS IS A WORKAROUND - project does not have `services` info - so we fetch APIKey object.
  const apiKey = await getAPIKey(project.id);

  if (!apiKey) {
    notFound();
  }

  return <PayConfig apiKey={apiKey} />;
}
