import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team/get-team";
import { TabPathLinks } from "@/components/ui/tabs";
import { loginRedirect } from "@/utils/redirects";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;

  const [team, authToken] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/settings`);
  }

  if (!team) {
    redirect("/team");
  }

  return (
    <div className="flex grow flex-col">
      <div className="border-border pt-10 pb-6">
        <div className="container max-w-6xl">
          <h1 className="font-semibold text-3xl tracking-tight">Billing</h1>
        </div>
      </div>

      <TabPathLinks
        links={[
          {
            exactMatch: true,
            name: "Overview",
            path: `/team/${params.team_slug}/~/billing`,
          },
          {
            name: "Invoices",
            path: `/team/${params.team_slug}/~/billing/invoices`,
          },
        ]}
        scrollableClassName="container max-w-6xl"
      />

      <div className="container max-w-6xl flex flex-col grow gap-8 pt-6 pb-10">
        {props.children}
      </div>
    </div>
  );
}
