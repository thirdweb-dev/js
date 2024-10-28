import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { InAppWalletsSummary } from "components/embedded-wallets/Analytics/Summary";
import { getInAppWalletUsage } from "data/analytics/wallets/in-app";
import { TRACKING_CATEGORY } from "../_constants";

export async function InAppWalletsHeader({ clientId }: { clientId: string }) {
  const allTimeStats = await getInAppWalletUsage({
    clientId,
    from: new Date(2022, 0, 1),
    to: new Date(),
    period: "all",
  });

  const monthlyStats = await getInAppWalletUsage({
    clientId,
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
    period: "month",
  });

  return (
    <div>
      <h1 className="mb-3 font-semibold text-2xl tracking-tight md:text-3xl">
        In-App Wallets
      </h1>
      <p className="mt-3 mb-7 max-w-[700px] text-muted-foreground">
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
      <InAppWalletsSummary
        allTimeStats={allTimeStats}
        monthlyStats={monthlyStats}
      />
    </div>
  );
}
