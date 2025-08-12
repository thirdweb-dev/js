import { redirect } from "next/navigation";
import { getProject } from "@/api/project/projects";
import { UnderlineLink } from "@/components/ui/UnderlineLink";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  return (
    <div className="flex grow flex-col">
      <div className="py-8 border-b">
        <div className="container max-w-7xl">
          <h1 className="mb-1 font-semibold text-2xl tracking-tight lg:text-3xl">
            RPC
          </h1>
          <p className="max-w-3xl text-muted-foreground text-sm leading-relaxed">
            Remote Procedure Call (RPC) provides reliable access to querying
            data and interacting with the blockchain through global edge RPCs.{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/rpc-edge"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more
            </UnderlineLink>
          </p>
        </div>
      </div>

      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col">
        {props.children}
      </div>
    </div>
  );
}
