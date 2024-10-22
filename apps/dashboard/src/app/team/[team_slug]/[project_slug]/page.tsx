import { redirect } from "next/navigation";

export default async function ProjectOverviewPage(
  props: {
    params: Promise<{ team_slug: string; project_slug: string }>;
  }
) {
  // TODO: implement overview page for project
  // redirect to connect for now
  redirect(
    `/team/${(await props.params).team_slug}/${(await props.params).project_slug}/connect`,
  );
}
