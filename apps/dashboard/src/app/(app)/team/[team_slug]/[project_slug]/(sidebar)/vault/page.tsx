import { redirect } from "next/navigation";

// Redirect old Vault page to new Server Wallets Configuration
export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  redirect(
    `/team/${params.team_slug}/${params.project_slug}/wallets/server-wallets/configuration`,
  );
}
