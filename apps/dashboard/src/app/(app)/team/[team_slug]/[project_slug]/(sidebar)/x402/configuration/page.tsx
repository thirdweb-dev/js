import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { loginRedirect } from "@/utils/redirects";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;

  const authToken = await getAuthToken();
  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/x402/configuration`,
    );
  }

  const project = await getProject(params.team_slug, params.project_slug);
  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <h2 className="text-2xl font-semibold">Coming Soon</h2>
        <p className="mt-2 text-muted-foreground">
          x402 payments configuration will be available soon.
        </p>
      </div>
    </div>
  );
}
