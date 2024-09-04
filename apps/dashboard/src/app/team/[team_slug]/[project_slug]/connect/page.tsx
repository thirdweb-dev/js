import { redirect } from "next/navigation";

export default function Page(props: {
  params: {
    team_slug: string;
    project_slug: string;
  };
}) {
  const { team_slug, project_slug } = props.params;
  redirect(`/team/${team_slug}/${project_slug}/connect/analytics`);
}
