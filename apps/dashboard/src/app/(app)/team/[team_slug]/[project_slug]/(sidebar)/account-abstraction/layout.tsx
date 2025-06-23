import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { getAbsoluteUrl } from "@/utils/vercel";
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
    redirect(`/team/${team_slug}`);
  }

  const isBundlerServiceEnabled = !!project.services.find(
    (s) => s.name === "bundler",
  );

  const hasSmartWalletsWithoutBilling =
    isBundlerServiceEnabled &&
    team.billingStatus !== "validPayment" &&
    team.billingStatus !== "pastDue";

  return (
    <AccountAbstractionLayout
      hasSmartWalletsWithoutBilling={hasSmartWalletsWithoutBilling}
      projectId={project.id}
      projectKey={project.publishableKey}
      projectSlug={project.slug}
      teamSlug={team_slug}
    >
      {props.children}
    </AccountAbstractionLayout>
  );
}

const seo = {
  desc: "Add account abstraction to your web3 app & unlock powerful features for seamless onboarding, customizable transactions, & maximum security. Get started.",
  title: "The Complete Account Abstraction Toolkit | thirdweb",
};

export const metadata: Metadata = {
  description: seo.desc,
  openGraph: {
    description: seo.desc,
    images: [
      {
        alt: seo.title,
        height: 630,
        url: `${getAbsoluteUrl()}/assets/og-image/dashboard-wallets-smart-wallet.png`,
        width: 1200,
      },
    ],
    title: seo.title,
  },
  title: seo.title,
};
