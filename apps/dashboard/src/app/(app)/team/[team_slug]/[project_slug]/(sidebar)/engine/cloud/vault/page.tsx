import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { getAuthToken } from "../../../../../../../api/lib/getAuthToken";
import { KeyManagement } from "./components/key-management";

export default async function VaultPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;
  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(team_slug, project_slug),
  ]);

  if (!project || !authToken) {
    notFound();
  }

  const projectEngineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const maskedAdminKey = projectEngineCloudService?.maskedAdminKey;

  return (
    <div className="flex flex-col gap-8">
      <KeyManagement
        maskedAdminKey={maskedAdminKey ?? undefined}
        project={project}
      />
    </div>
  );
}
