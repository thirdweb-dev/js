import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { TabPathLinks } from "@/components/ui/tabs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { THIRDWEB_ENGINE_CLOUD_URL } from "../../../../../@/constants/env";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  children: React.ReactNode;
}) {
  const { team_slug, project_slug } = await props.params;

  const [team, project] = await Promise.all([
    getTeamBySlug(team_slug),
    getProject(team_slug, project_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  return (
    <TransactionsLayout
      projectSlug={project.slug}
      teamSlug={team_slug}
      clientId={project.publishableKey}
    >
      {props.children}
    </TransactionsLayout>
  );
}

function TransactionsLayout(props: {
  projectSlug: string;
  teamSlug: string;
  clientId: string;
  children: React.ReactNode;
}) {
  const smartWalletsLayoutSlug = `/team/${props.teamSlug}/${props.projectSlug}/transactions`;

  return (
    <div className="flex grow flex-col">
      {/* top */}
      <div className="pt-4 lg:pt-6">
        {/* header */}
        <div className="container flex max-w-7xl flex-col gap-4">
          <div>
            <h1 className="mb-0.5 font-semibold text-2xl tracking-tight lg:text-3xl">
              Transactions
            </h1>
            <Link
              href={`${THIRDWEB_ENGINE_CLOUD_URL}/reference`} // TODO: change this
              target="_blank"
              className="-translate-x-2 max-w-full truncate py-1 text-muted-foreground"
            >
              {THIRDWEB_ENGINE_CLOUD_URL}
            </Link>
          </div>
        </div>

        <div className="h-4" />

        {/* Nav */}
        <TabPathLinks
          scrollableClassName="container max-w-7xl"
          links={[
            {
              name: "Analytics",
              path: `${smartWalletsLayoutSlug}`,
              exactMatch: true,
            },
            {
              name: "Server Wallets",
              path: `${smartWalletsLayoutSlug}/server-wallets`,
            },
            {
              name: "Explorer",
              path: `${smartWalletsLayoutSlug}/explorer`,
            },
          ]}
        />
      </div>

      {/* content */}
      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col gap-6">
        <div>{props.children}</div>
      </div>
      <div className="h-20" />
    </div>
  );
}

// TODO: seo and add metadata

// const seo = {
//   title: "TODO",
//   desc: "TODO",
// };

// export const metadata: Metadata = {
//   title: seo.title,
//   description: seo.desc,
//   openGraph: {
//     title: seo.title,
//     description: seo.desc,
//     images: [
//       {
//         url: `${getAbsoluteUrl()}/assets/og-image/TODO`,
//         width: 1200,
//         height: 630,
//         alt: seo.title,
//       },
//     ],
//   },
// };
