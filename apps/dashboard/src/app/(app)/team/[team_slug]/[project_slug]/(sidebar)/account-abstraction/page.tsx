import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { getUserOpUsage } from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import {
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { SmartAccountIcon } from "@/icons/SmartAccountIcon";
import { getAbsoluteUrl } from "@/utils/vercel";
import { AccountAbstractionSummary } from "./AccountAbstractionAnalytics/AccountAbstractionSummary";
import { SmartWalletsBillingAlert } from "./Alerts";
import { AccountAbstractionAnalytics } from "./aa-analytics";
import { searchParamLoader } from "./search-params";

interface PageParams {
  team_slug: string;
  project_slug: string;
}

export default async function Page(props: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
  children: React.ReactNode;
}) {
  const [params, searchParams, authToken] = await Promise.all([
    props.params,
    searchParamLoader(props.searchParams),
    getAuthToken(),
  ]);

  if (!authToken) {
    notFound();
  }

  const [team, project] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const interval = searchParams.interval ?? "week";
  const rangeType = searchParams.range || "last-120";

  const range: Range = {
    from:
      rangeType === "custom"
        ? searchParams.from
        : getLastNDaysRange(rangeType).from,
    to:
      rangeType === "custom"
        ? searchParams.to
        : getLastNDaysRange(rangeType).to,
    type: rangeType,
  };

  const userOpStats = await getUserOpUsage(
    {
      from: range.from,
      period: interval,
      projectId: project.id,
      teamId: project.teamId,
      to: range.to,
    },
    authToken,
  );

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  const isBundlerServiceEnabled = !!project.services.find(
    (s) => s.name === "bundler",
  );

  const hasSmartWalletsWithoutBilling =
    isBundlerServiceEnabled &&
    team.billingStatus !== "validPayment" &&
    team.billingStatus !== "pastDue";

  return (
    <ProjectPage
      header={{
        icon: SmartAccountIcon,
        client,
        title: "Account Abstraction",
        description:
          "Integrate EIP-7702 and EIP-4337 compliant smart accounts for gasless sponsorships and more.",
        actions: null,
        settings: {
          href: `/team/${params.team_slug}/${params.project_slug}/settings/account-abstraction`,
        },
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/transactions/sponsor",
          },
          {
            type: "playground",
            href: "https://playground.thirdweb.com/account-abstraction/eip-7702",
          },
        ],
      }}
    >
      {hasSmartWalletsWithoutBilling && (
        <>
          <SmartWalletsBillingAlert teamSlug={params.team_slug} />
          <div className="h-10" />
        </>
      )}
      <div className="flex grow flex-col gap-10">
        <AccountAbstractionSummary
          projectId={project.id}
          teamId={project.teamId}
          authToken={authToken}
        />

        <AccountAbstractionAnalytics
          client={client}
          projectId={project.id}
          teamId={project.teamId}
          teamSlug={params.team_slug}
          userOpStats={userOpStats}
        />
      </div>
    </ProjectPage>
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
