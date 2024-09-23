import { getProject } from "@/api/projects";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { notFound } from "next/navigation";
import { InAppWalletUsersPageContent } from "../../../../../../components/embedded-wallets/Users";
import { AnalyticsCallout } from "./_components/AnalyticsCallout";
import { InAppWaletFooterSection } from "./_components/footer";

export default async function Page(props: {
  params: {
    team_slug: string;
    project_slug: string;
  };
}) {
  const project = await getProject(
    props.params.team_slug,
    props.params.project_slug,
  );

  if (!project) {
    notFound();
  }

  const TRACKING_CATEGORY = "team/in-app-wallets";

  return (
    <div>
      <h1 className="mb-3 font-semibold text-2xl tracking-tight md:text-3xl">
        In-App Wallets
      </h1>

      <p className="mt-3 mb-7 max-w-[700px] text-muted-foreground">
        A wallet infrastructure that enables apps to create, manage, and control
        their users wallets. Email login, social login, and bring-your-own auth
        supported.
        <TrackedLinkTW
          target="_blank"
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
          label="learn-more"
          category={TRACKING_CATEGORY}
          className="text-link-foreground hover:text-foreground"
        >
          Learn more
        </TrackedLinkTW>
      </p>

      <InAppWalletUsersPageContent
        clientId={project.publishableKey}
        trackingCategory={TRACKING_CATEGORY}
      />

      <div className="h-16" />
      <AnalyticsCallout trackingCategory={TRACKING_CATEGORY} />
      <div className="h-5" />

      <InAppWaletFooterSection trackingCategory={TRACKING_CATEGORY} />
    </div>
  );
}
