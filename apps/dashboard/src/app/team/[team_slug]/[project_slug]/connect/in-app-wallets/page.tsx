import { redirect } from "next/navigation";

export default async function Page(props: {
  params: {
    team_slug: string;
    project_slug: string;
  };
}) {
  // Default to the users tab
  redirect(
    `/team/${props.params.team_slug}/${props.params.project_slug}/connect/in-app-wallets/analytics`,
  );
}
