import { redirect } from "next/navigation";
import { EmbeddedWallets } from "../../../../../../components/embedded-wallets";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { PageHeader } from "../PageHeader";
import { getInAppWalletSupportedAPIKeys } from "../getInAppWalletSupportedAPIKeys";
import { InAppWalletsAPIKeysMenu } from "../inAppWalletsAPIKeysMenu";

export default async function Page(props: {
  params: Promise<{
    clientId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}) {
  const authToken = getAuthToken();
  const { clientId } = (await props.params);

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

  return (
    (<div>
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
      <EmbeddedWallets
        apiKey={apiKey}
        trackingCategory="embedded-wallet"
        defaultTab={(await props.searchParams).tab === "1" ? 1 : 0}
      />
    </div>)
  );
}
