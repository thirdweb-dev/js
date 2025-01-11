import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { BoxIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { fetchAllBlueprints } from "./utils";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const authToken = await getAuthToken();

  if (!authToken) {
    const { team_slug, project_slug } = await props.params;
    return redirect(
      `/login?next=${encodeURIComponent(`/team/${team_slug}/${project_slug}/insight`)}`,
    );
  }

  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b py-10">
        <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
            Insight
          </h1>
          <ToolTipLabel label="Coming Soon">
            <Button className="gap-2" disabled>
              <PlusIcon className="size-4" />
              Add Blueprint <span className="lg:hidden"> (Coming Soon) </span>
            </Button>
          </ToolTipLabel>
        </div>
      </div>

      <div className="container py-8 pb-20">
        <BlueprintsSection
          authToken={authToken}
          layoutPath={`/team/${params.team_slug}/${params.project_slug}/insight`}
        />
      </div>
    </div>
  );
}

async function BlueprintsSection(params: {
  authToken: string;
  layoutPath: string;
}) {
  const blueprints = await fetchAllBlueprints(params);

  return (
    <div>
      <h2 className="mb-5 font-semibold text-2xl tracking-tight">
        Explore Blueprints
      </h2>
      <div className="flex flex-col gap-8">
        {blueprints.map((blueprint) => {
          const paths = Object.keys(blueprint.openapiJson.paths);
          return (
            <div key={blueprint.id}>
              <h2 className="font-semibold text-lg tracking-tight">
                {blueprint.name}
              </h2>
              <p className="mb-2 text-muted-foreground">
                {blueprint.description}
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {paths.map((pathName) => {
                  const pathObj = blueprint.openapiJson.paths[pathName];
                  if (!pathObj) {
                    return null;
                  }
                  return (
                    <BlueprintCard
                      description={pathObj.get?.description}
                      title={pathObj.get?.summary || pathName}
                      href={`${params.layoutPath}/${blueprint.id}?path=${pathName}`}
                      key={pathName}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlueprintCard(props: {
  href: string;
  title: string;
  description: string | undefined;
}) {
  return (
    <div className="relative flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-5 hover:bg-muted/70">
      <div className="shrink-0 rounded-xl border p-1">
        <div className="rounded-lg border bg-muted p-1">
          <BoxIcon className="size-5 text-muted-foreground" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Link
          className="group static before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-0"
          href={props.href}
        >
          <h2 className="font-medium text-base">{props.title}</h2>
        </Link>

        {props.description && (
          <p className="line-clamp-1 text-muted-foreground text-sm">
            {props.description}
          </p>
        )}
      </div>
    </div>
  );
}
