import { getProject } from "@/api/projects";
import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { notFound } from "next/navigation";
import { getAPIKeyForProjectId } from "../../../../../api/lib/getAPIKeys";
import { AccountAbstractionPage } from "./AccountAbstractionPage";

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
    <ChakraProviderSetup>
      <AccountAbstractionPage apiKeyServices={apiKey.services || []} />
    </ChakraProviderSetup>
  );
}
