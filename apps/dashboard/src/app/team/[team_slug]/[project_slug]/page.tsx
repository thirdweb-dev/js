import { redirect } from "next/navigation";

export default function ProjectOverviewPage(props: {
  params: { team_slug: string; project_slug: string };
}) {
  // TODO: implement overview page for project
  // redirect to connect for now
  redirect(
    `/team/${props.params.team_slug}/${props.params.project_slug}/connect`,
  );
}
