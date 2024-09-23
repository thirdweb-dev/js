import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { type ApiKey, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { AppLayout } from "components/app-layouts/app";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import Link from "next/link";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useMemo, useState } from "react";
import type { ThirdwebNextPage } from "utils/types";
import { ConnectSidebarLayout } from "../../../app/(dashboard)/dashboard/connect/DashboardConnectLayout";
import { ConnectAnalyticsDashboard } from "../../../app/team/[team_slug]/[project_slug]/connect/analytics/ConnectAnalyticsDashboard";
import { ConnectSDKCard } from "../../../components/shared/ConnectSDKCard";

const DashboardConnectAnalytics: ThirdwebNextPage = () => {
  const router = useRouter();
  const defaultClientId = router.query.clientId?.toString();
  const loggedInUser = useLoggedInUser();
  const keysQuery = useApiKeys();
  const [selectedKey_, setSelectedKey] = useState<undefined | ApiKey>();

  const apiKeys = useMemo(() => {
    return keysQuery?.data || [];
  }, [keysQuery]);

  // compute the actual selected key based on if there is a state, if there is a query param, or otherwise the first one
  const selectedKey = useMemo(() => {
    if (selectedKey_) {
      return selectedKey_;
    }
    if (apiKeys.length) {
      if (defaultClientId) {
        return apiKeys.find((k) => k.key === defaultClientId);
      }
      return apiKeys[0];
    }
    return undefined;
  }, [apiKeys, defaultClientId, selectedKey_]);

  const showLoader = loggedInUser.isPending || keysQuery.isPending;

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

        {/* API selector */}
        {keysQuery.data && selectedKey && (
          <div>
            <ApiKeysMenu
              apiKeys={keysQuery.data}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />
          </div>
        )}
      </div>

      <div className="h-4 lg:h-8" />

      {showLoader ? (
        <div className="grid h-[800px] w-full place-items-center rounded-lg border border-border bg-muted/50">
          <Spinner className="size-14" />
        </div>
      ) : (
        <>
          {selectedKey ? (
            <ConnectAnalyticsDashboard clientId={selectedKey.key} />
          ) : (
            <NoAPIFoundCard />
          )}
        </>
      )}

      <div className="h-4 lg:h-8" />
      <ConnectSDKCard description="Add the Connect SDK to your app to start collecting analytics." />
    </div>
  );
};

function NoAPIFoundCard() {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-muted/50 px-4 py-10 lg:px-6">
      <h3 className="mb-3 font-semibold text-2xl">No API keys found</h3>
      <p className="mb-6 text-muted-foreground text-sm">
        Start using the Connect SDK in your app with a free API key.
      </p>
      <Button asChild variant="primary">
        <Link href="/dashboard/settings/api-keys">Create API Key</Link>
      </Button>
    </div>
  );
}

DashboardConnectAnalytics.getLayout = (page, props) => (
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <ConnectSidebarLayout>{page}</ConnectSidebarLayout>
  </AppLayout>
);

DashboardConnectAnalytics.pageId = PageId.DashboardConnectAnalytics;

export default DashboardConnectAnalytics;
