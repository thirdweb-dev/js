import { getProject } from "@/api/projects";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { BlueprintPlayground } from "./blueprint-playground.client";
import {
  getBlueprintMeta,
  isThirdwebBlueprintSlug,
} from "./getBlueprintMetadata";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
    blueprint_slug: string;
  }>;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    return redirect(`/team/${params.team_slug}`);
  }

  // currently - only thirdweb blueprints are supported
  if (!isThirdwebBlueprintSlug(params.blueprint_slug)) {
    return redirect(`/team/${params.team_slug}/${params.project_slug}/insight`);
  }

  const metadata = await getBlueprintMeta(params.blueprint_slug).catch(
    () => null,
  );

  // this should never happen, but it happens sometimes because the schema endpoint fetch sometimes fails
  if (!metadata) {
    return (
      <div className="container flex grow flex-col py-10">
        <Alert variant="destructive">
          <CircleAlertIcon className="size-4" />
          <AlertTitle>
            Failed to fetch metadata for blueprint "{params.blueprint_slug}"
          </AlertTitle>
        </Alert>
      </div>
    );
  }

  return (
    <BlueprintPlayground
      metadata={metadata}
      backLink={`/team/${params.team_slug}/${params.project_slug}/insight`}
      clientId={project.publishableKey}
    />
  );
}
