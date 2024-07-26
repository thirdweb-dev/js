import { getProjects } from "@/api/projects";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

export default async function TeamOverviewPage(props: {
  params: { team_slug: string };
}) {
  const projects = await getProjects(props.params.team_slug);

  return (
    <>
      <div className="py-8 bg-card border-b">
        <div className="container flex flex-row justify-between items-center">
          <h2 className="font-medium text-3xl tracking-tight">Projects</h2>
        </div>
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
        {projects.map((project) => {
          return (
            <Card
              key={project.id}
              className="relative hover:border-foreground/40 min-h-48"
            >
              <CardHeader>
                <Link
                  className="static group before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:z-0"
                  // TODO: when we implement project overview page remove the `/connect`
                  href={`/team/${props.params.team_slug}/${project.slug}/connect`}
                >
                  <CardTitle>{project.name}</CardTitle>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 items-center">
                  <Label className="col-span-1">Client ID</Label>
                  <CopyTextButton
                    className="col-span-4 z-50"
                    textToCopy={project.publishableKey}
                    textToShow={project.publishableKey}
                    copyIconPosition="right"
                    tooltip="Copy Client ID"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Card className="relative opacity-50 grid place-items-center min-h-48">
          <div className="flex flex-row gap-4 items-center">
            <PlusCircleIcon className="size-6" />
            <Link
              className="cursor-not-allowed static group before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:z-0"
              // TODO: will be: /team/create
              href={`/team/${props.params.team_slug}`}
              aria-disabled="true"
            >
              Create Project
            </Link>
          </div>
          <Badge className="absolute top-2 right-2" variant="secondary">
            Soon{"™️"}
          </Badge>
        </Card>
      </div>
    </>
  );
}
