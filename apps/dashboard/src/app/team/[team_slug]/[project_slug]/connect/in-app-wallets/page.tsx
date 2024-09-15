import { getProject } from "@/api/projects";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { notFound } from "next/navigation";
import { EmbeddedWallets } from "../../../../../../components/embedded-wallets";
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
    <div className="pb-10 max-sm:pt-6">
      <h1 className="font-semibold text-2xl md:text-3xl tracking-tight mb-3">
        In-App Wallets
      </h1>

      <p className="max-w-[700px] text-muted-foreground mt-3 mb-7">
        A wallet infrastructure that enables apps to create, manage, and control
        their users wallets. Email login, social login, and bring-your-own auth
        supported.{" "}
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

      <EmbeddedWallets
        apiKey={{
          ...project,
          key: project.publishableKey, // clientId
        }}
        trackingCategory={TRACKING_CATEGORY}
      />

      <div className="h-16" />
      <AnalyticsCallout trackingCategory={TRACKING_CATEGORY} />
      <div className="h-5" />

      <InAppWaletFooterSection trackingCategory={TRACKING_CATEGORY} />
    </div>
  );
}
