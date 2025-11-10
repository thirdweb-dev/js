import { redirect } from "next/navigation";

// Redirect old Account Abstraction page to new Sponsored Gas Overview
export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  redirect(
    `/team/${params.team_slug}/${params.project_slug}/wallets/sponsored-gas`,
  );
}
