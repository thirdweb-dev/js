import { redirect } from "next/navigation";

export default async function WebhooksPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;

  // for the moment redirect to the "/contracts webhooks"
  redirect(
    `/team/${params.team_slug}/${params.project_slug}/webhooks/contracts`,
  );
}
