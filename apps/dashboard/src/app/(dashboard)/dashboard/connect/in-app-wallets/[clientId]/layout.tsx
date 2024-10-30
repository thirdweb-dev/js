import { InAppWalletsSummary } from "components/embedded-wallets/Analytics/Summary";
import { getInAppWalletUsage } from "data/analytics/wallets/in-app";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { PageHeader } from "../PageHeader";
import { getInAppWalletSupportedAPIKeys } from "../getInAppWalletSupportedAPIKeys";
import { InAppWalletsAPIKeysMenu } from "../inAppWalletsAPIKeysMenu";
import { Tabs } from "./_components/tabs";

export default async function Page(props: {
  params: {
    clientId: string;
  };
  searchParams: {
    tab?: string;
  };
  children: React.ReactNode;
}) {
  const authToken = getAuthToken();
  const { clientId } = props.params;

  if (!authToken) {
    redirect(
      `/login?next=${encodeURIComponent(`/dashboard/connect/in-app-wallets/${clientId}`)}`,
    );
  }

  const apiKeys = await getInAppWalletSupportedAPIKeys();
  const apiKey = apiKeys.find((key) => key.key === clientId);

  if (!apiKey) {
    redirect("/dashboard/connect/in-app-wallets");
  }

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
      {/* header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <PageHeader />
        <div>
          <InAppWalletsAPIKeysMenu
            apiKeys={apiKeys.map((x) => ({
              name: x.name,
              key: x.key,
            }))}
            selectedAPIKey={apiKey}
          />
        </div>
      </div>

      <div className="h-8" />

      <InAppWalletsSummary
        allTimeStats={allTimeStats}
        monthlyStats={monthlyStats}
      />

      <div className="h-8" />
      <Tabs clientId={clientId} />
      <div className="h-8" />
      {props.children}
    </div>
  );
}
