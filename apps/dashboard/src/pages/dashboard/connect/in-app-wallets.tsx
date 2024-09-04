import { Spinner } from "@/components/ui/Spinner/Spinner";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { type ApiKey, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { AppLayout } from "components/app-layouts/app";
import { EmbeddedWallets } from "components/embedded-wallets";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { NoApiKeys } from "components/settings/ApiKeys/NoApiKeys";
import { ConnectSidebar } from "core-ui/sidebar/connect";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useMemo, useState } from "react";
import type { ThirdwebNextPage } from "utils/types";
import { AnalyticsCallout } from "../../../app/team/[team_slug]/[project_slug]/connect/in-app-wallets/_components/AnalyticsCallout";
import { InAppWaletFooterSection } from "../../../app/team/[team_slug]/[project_slug]/connect/in-app-wallets/_components/footer";

const TRACKING_CATEGORY = "embedded-wallet";

const DashboardConnectEmbeddedWallets: ThirdwebNextPage = () => {
  const router = useRouter();
  const defaultClientId = router.query.clientId?.toString();
  const { isLoading } = useLoggedInUser();
  const keysQuery = useApiKeys();

  const [selectedKey_, setSelectedKey] = useState<undefined | ApiKey>();

  const apiKeys = useMemo(() => {
    return (keysQuery?.data || []).filter((key) => {
      return !!(key.services || []).find(
        (srv) => srv.name === "embeddedWallets",
      );
    });
  }, [keysQuery]);

  const hasApiKeys = apiKeys.length > 0;

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

  if (isLoading) {
    return (
      <div className="grid w-full place-items-center">
        <Spinner className="size-14" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex lg:justify-between gap-4 flex-col lg:flex-row">
        <div>
          <h1 className="font-semibold text-3xl tracking-tigher">
            In-App Wallets
          </h1>

          <div className="h-3" />

          <p className="max-w-[500px] text-muted-foreground ">
            A wallet infrastructure that enables apps to create, manage, and
            control their users wallets. Email login, social login, and
            bring-your-own auth supported.{" "}
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
        </div>

        <div>
          {hasApiKeys && selectedKey && (
            <ApiKeysMenu
              apiKeys={apiKeys}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />
          )}
        </div>
      </div>

      <div className="h-8" />

      {keysQuery.isLoading ? (
        <div className="flex h-[500px] items-center justify-center">
          <Spinner className="size-10" />
        </div>
      ) : (
        <>
          {!hasApiKeys && <NoApiKeys service="in-app wallets" />}

          {hasApiKeys && selectedKey && (
            <EmbeddedWallets
              apiKey={selectedKey}
              trackingCategory={TRACKING_CATEGORY}
            />
          )}
        </>
      )}

      <div className="h-16" />
      <AnalyticsCallout trackingCategory={TRACKING_CATEGORY} />
      <div className="h-5" />

      <InAppWaletFooterSection trackingCategory={TRACKING_CATEGORY} />
    </div>
  );
};

DashboardConnectEmbeddedWallets.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <ConnectSidebar activePage="embedded-wallets" />
    {page}
  </AppLayout>
);

DashboardConnectEmbeddedWallets.pageId = PageId.DashboardConnectEmbeddedWallets;

export default DashboardConnectEmbeddedWallets;
