import { redirect } from "next/navigation";
import { NoApiKeys } from "../../../../../components/settings/ApiKeys/NoApiKeys";
import { ConnectSDKCard } from "../../../../../components/shared/ConnectSDKCard";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { PageHeader } from "./PageHeader";
import { getAASupportedAPIKeys } from "./getAASupportedAPIKeys";

export default async function Page() {
  const authToken = await getAuthToken();

  if (!authToken) {
    redirect(
      `/login?next=${encodeURIComponent("/dashboard/connect/account-abstraction")}`,
    );
  }

  const apiKeys = await getAASupportedAPIKeys();
  const firstKey = apiKeys[0];

  if (firstKey) {
    redirect(`/dashboard/connect/account-abstraction/${firstKey.key}`);
  }

  return (
    <div>
      <PageHeader />
      <div className="h-8" />
      <NoApiKeys service="Account Abstraction" />
      <div className="h-10" />
      <ConnectSDKCard
        title="Get Started"
        description="Add account abstraction to your app with the Connect SDK."
      />
    </div>
  );
}
