import { redirect } from "next/navigation";
import { NoApiKeys } from "../../../../../components/settings/ApiKeys/NoApiKeys";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { InAppWaletFooterSection } from "../../../../team/[team_slug]/[project_slug]/connect/in-app-wallets/_components/footer";
import { PageHeader } from "./PageHeader";
import { getInAppWalletSupportedAPIKeys } from "./getInAppWalletSupportedAPIKeys";

export default async function Page() {
  const authToken = await getAuthToken();

  if (!authToken) {
    redirect(
      `/login?next=${encodeURIComponent("/dashboard/connect/in-app-wallets")}`,
    );
  }

  const apiKeys = await getInAppWalletSupportedAPIKeys();
  const firstKey = apiKeys[0];

  if (firstKey) {
    redirect(`/dashboard/connect/in-app-wallets/${firstKey.key}`);
  }

  return (
    <div>
      <PageHeader />
      <div className="h-8" />
      <NoApiKeys service="in-app wallets" />
      <div className="h-16" />
      <InAppWaletFooterSection trackingCategory="embedded-wallet" />
    </div>
  );
}
