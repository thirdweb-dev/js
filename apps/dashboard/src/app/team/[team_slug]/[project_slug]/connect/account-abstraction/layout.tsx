import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getAbsoluteUrl } from "../../../../../../lib/vercel-utils";
import { getAPIKeyForProjectId } from "../../../../../api/lib/getAPIKeys";
import { AccountAbstractionLayout } from "./AccountAbstractionPage";

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
    redirect("/team");
  }

  const apiKey = await getAPIKeyForProjectId(project.id);

  if (!apiKey) {
    notFound();
  }

  return (
    <AccountAbstractionLayout
      projectSlug={project.slug}
      teamSlug={team_slug}
      billingStatus={team.billingStatus}
      projectKey={project.publishableKey}
      apiKeyServices={apiKey.services || []}
    >
      {props.children}
    </AccountAbstractionLayout>
  );
}

const seo = {
  title: "The Complete Account Abstraction Toolkit | thirdweb",
  desc: "Add account abstraction to your web3 app & unlock powerful features for seamless onboarding, customizable transactions, & maximum security. Get started.",
};

export const metadata: Metadata = {
  title: seo.title,
  description: seo.desc,
  openGraph: {
    title: seo.title,
    description: seo.desc,
    images: [
      {
        url: `${getAbsoluteUrl()}/assets/og-image/dashboard-wallets-smart-wallet.png`,
        width: 1200,
        height: 630,
        alt: seo.title,
      },
    ],
  },
};
