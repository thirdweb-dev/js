import { redirect } from "next/navigation";
import { ConnectSDKCard } from "../../../../../../components/shared/ConnectSDKCard";
import { getApiKeys } from "../../../../../api/lib/getAPIKeys";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { ConnectAnalyticsDashboard } from "../../../../../team/[team_slug]/[project_slug]/connect/analytics/ConnectAnalyticsDashboard";
import { AnalyticsPageAPIKeysMenu } from "./AnalyticsPageAPIKeysMenu";

export default async function Page(props: {
  params: {
    clientId: string;
  };
}) {
  const authToken = getAuthToken();
  const { clientId } = props.params;

  if (!authToken) {
    redirect(
      `/login?next=${encodeURIComponent(`/dashboard/connect/analytics/${clientId}`)}`,
    );
  }

  const _apiKeys = await getApiKeys();
  // slimmed down version to reduce client side payload
  const apiKeys = _apiKeys.map((key) => ({
    name: key.name,
    key: key.key,
  }));

  const apiKey = apiKeys.find((key) => key.key === clientId);

  if (!apiKey) {
    redirect("/dashboard/connect/analytics");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mb-1 font-semibold text-3xl tracking-tight">
            Connect Analytics
          </h1>
          <p className="text-muted-foreground">
            Visualize how users are connecting to your apps.
          </p>
        </div>

        <div>
          <AnalyticsPageAPIKeysMenu apiKeys={apiKeys} selectedAPIKey={apiKey} />
        </div>
      </div>

      <div className="h-4 lg:h-8" />

      <ConnectAnalyticsDashboard
        clientId={apiKey.key}
        connectLayoutSlug="/dashboard/connect"
      />

      <div className="h-4 lg:h-8" />
      <ConnectSDKCard description="Add the Connect SDK to your app to start collecting analytics." />
    </div>
  );
}
