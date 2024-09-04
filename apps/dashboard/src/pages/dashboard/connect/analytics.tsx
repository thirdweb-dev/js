import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  type ApiKey,
  useApiKeys,
  useWalletStats,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { SiReact } from "@react-icons/all-files/si/SiReact";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { SiUnity } from "@react-icons/all-files/si/SiUnity";
import { AppLayout } from "components/app-layouts/app";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { ConnectSidebar } from "core-ui/sidebar/connect";
import Link from "next/link";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useMemo, useState } from "react";
import { SiUnrealengine } from "react-icons/si";
import { SiDotnet } from "react-icons/si";
import type { ThirdwebNextPage } from "utils/types";
import { Button } from "../../../@/components/ui/button";
import { ConnectAnalyticsDashboard } from "../../../app/team/[team_slug]/[project_slug]/connect/analytics/ConnectAnalyticsDashboard";

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

  const statsQuery = useWalletStats(selectedKey?.key);
  const showLoader = loggedInUser.isLoading || keysQuery.isLoading;

  return (
    <div>
      <div className="flex lg:items-center gap-4 flex-col lg:flex-row lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-1">
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
        <div className="grid w-full place-items-center h-[800px] border border-border rounded-lg bg-muted/50">
          <Spinner className="size-14" />
        </div>
      ) : (
        <>
          {selectedKey ? (
            <ConnectAnalyticsDashboard
              walletStats={
                statsQuery.data || {
                  timeSeries: [],
                }
              }
              isLoading={statsQuery.isLoading}
            />
          ) : (
            <NoAPIFoundCard />
          )}
        </>
      )}

      <div className="h-4 lg:h-8" />
      <SDKCtaSection />
    </div>
  );
};

function NoAPIFoundCard() {
  return (
    <div className="bg-muted/50 border border-border rounded-lg py-10 px-4 lg:px-6 flex items-center flex-col">
      <h3 className="font-semibold text-2xl mb-3">No API keys found</h3>
      <p className="text-muted-foreground text-sm mb-6">
        Start using the Connect SDK in your app with a free API key.
      </p>
      <Button asChild variant="primary">
        <Link href={"/dashboard/settings/api-keys"}>Create API Key</Link>
      </Button>
    </div>
  );
}

function SDKCtaSection() {
  return (
    <div className="border border-border bg-muted/50 rounded-lg p-6 relative">
      <h3 className="text-2xl font-semibold tracking-tight mb-1">
        Connect SDK
      </h3>
      <p className="mb-8 text-muted-foreground text-sm">
        Add the Connect SDK to your app to start collecting analytics.
      </p>

      <div className="grid gap-6 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[500px]">
        <DocLink
          link="https://portal.thirdweb.com/typescript/v5/getting-started"
          icon={SiTypescript}
          label="TypeScript SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/react/v5/getting-started"
          icon={SiReact}
          label="React SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/react-native/v5/getting-started"
          icon={SiReact}
          label="React Native SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/unity/v4/getting-started"
          icon={SiUnity}
          label="Unity SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/unreal/getting-started"
          icon={SiUnrealengine}
          label="Unreal SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/dotnet/getting-started"
          icon={SiDotnet}
          label=".NET SDK"
        />
      </div>

      <BackgroundPattern />
    </div>
  );
}

function BackgroundPattern() {
  const color = "hsl(var(--foreground)/50%)";
  return (
    <div
      className="hidden xl:block absolute w-[50%] right-2 top-4 bottom-4 z-[1]"
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        maskImage: "linear-gradient(to left, black, transparent)",
      }}
    />
  );
}

function DocLink(props: {
  link: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <Link
      href={props.link}
      target="_blank"
      className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"
    >
      <props.icon className="size-4" />
      {props.label}
    </Link>
  );
}

DashboardConnectAnalytics.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <ConnectSidebar activePage="analytics" />
    {page}
  </AppLayout>
);

DashboardConnectAnalytics.pageId = PageId.DashboardConnectAnalytics;

export default DashboardConnectAnalytics;
