import { accountStatus } from "@3rdweb-sdk/react/hooks/useApi";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeys/Alerts";
import { ConnectSDKCard } from "components/shared/ConnectSDKCard";
import { SmartWallets } from "components/smart-wallets";
import { redirect } from "next/navigation";
import { getAccount } from "../../../../../account/settings/getAccount";
import { AccountAbstractionAPIKeysMenu } from "../AccountAbstractionAPIKeysMenu";
import { OpChainAlert } from "../OpChainAlert";
import { PageHeader } from "../PageHeader";
import { getAASupportedAPIKeys } from "../getAASupportedAPIKeys";

export default async function Page(props: {
  params: Promise<{
    clientId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}) {
  const { clientId } = await props.params;
  const dashboardAccount = await getAccount();

  if (!dashboardAccount) {
    redirect(
      `/login?next=${encodeURIComponent(
        `/dashboard/connect/account-abstraction/${clientId}`,
      )}`,
    );
  }

  const apiKeys = await getAASupportedAPIKeys();
  const apiKey = apiKeys.find((key) => key.key === clientId);

  if (!apiKey) {
    redirect("/dashboard/connect/account-abstraction");
  }

  const hasSmartWalletsWithoutBilling = apiKeys.find((k) =>
    k.services?.find(
      (s) =>
        dashboardAccount.status !== accountStatus.validPayment &&
        s.name === "bundler",
    ),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col content-start justify-between gap-4 lg:flex-row">
        <PageHeader />

        <div>
          <AccountAbstractionAPIKeysMenu
            apiKeys={apiKeys.map((x) => ({
              name: x.name,
              key: x.key,
            }))}
            selectedAPIKey={apiKey}
          />
        </div>
      </div>
      {hasSmartWalletsWithoutBilling ? (
        <SmartWalletsBillingAlert />
      ) : (
        <OpChainAlert />
      )}
      <SmartWallets
        apiKeyServices={apiKey.services || []}
        trackingCategory="smart-wallet"
        tab={(await props.searchParams).tab}
        smartWalletsLayoutSlug={`/dashboard/connect/account-abstraction/${clientId}`}
        clientId={apiKey.key}
      />
      <ConnectSDKCard
        title="Get Started"
        description="Add account abstraction to your app with the Connect SDK."
      />
    </div>
  );
}
