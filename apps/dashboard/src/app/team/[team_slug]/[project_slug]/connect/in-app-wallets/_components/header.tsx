import { getInAppWalletUsage } from "@/api/analytics";
import { TrackedUnderlineLink } from "@/components/ui/tracked-link";
import { InAppWalletsSummary } from "components/embedded-wallets/Analytics/Summary";
import { subDays } from "date-fns";
import { TRACKING_CATEGORY } from "../_constants";

export async function InAppWalletsHeader({
  teamId,
  projectId,
}: { teamId: string; projectId: string }) {
  const allTimeStatsPromise = getInAppWalletUsage({
    teamId,
    projectId,
    from: new Date(2022, 0, 1),
    to: new Date(),
    period: "all",
  });

  const monthlyStatsPromise = getInAppWalletUsage({
    teamId,
    projectId,
    from: subDays(new Date(), 30),
    to: new Date(),
    period: "month",
  });

  const [allTimeStats, monthlyStats] = await Promise.all([
    allTimeStatsPromise,
    monthlyStatsPromise,
  ]).catch(() => [null, null]);

  return (
    <div>
      <h1 className="mb-1 font-semibold text-2xl tracking-tight lg:mb-2 lg:text-3xl">
        In-App Wallets
      </h1>
      <p className="mb-7 max-w-[700px] text-muted-foreground text-sm leading-relaxed">
        A wallet infrastructure that enables apps to create, manage, and control
        their users wallets. Email login, social login, and bring-your-own auth
        supported.{" "}
        <TrackedUnderlineLink
          target="_blank"
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
          label="learn-more"
          category={TRACKING_CATEGORY}
        >
          Learn more
        </TrackedUnderlineLink>
      </p>
      <InAppWalletsSummary
        allTimeStats={allTimeStats || []}
        monthlyStats={monthlyStats || []}
      />
    </div>
  );
}
