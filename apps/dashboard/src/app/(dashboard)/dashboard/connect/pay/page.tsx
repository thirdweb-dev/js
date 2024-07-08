"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { TabButtons } from "@/components/ui/tabs";
import { apiKeys } from "@3rdweb-sdk/react";
import { type ApiKey, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useQueryClient } from "@tanstack/react-query";
import { PayAnalytics } from "components/pay/PayAnalytics/PayAnalytics";
import { PayConfig } from "components/pay/PayConfig";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { NoApiKeys } from "components/settings/ApiKeys/NoApiKeys";
import { useEffect, useMemo, useState } from "react";
import { TrackedLink } from "tw-components";

const TRACKING_CATEGORY = "pay";

function usePayConfig() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  const [selectedKey_, setSelectedKey] = useState<undefined | ApiKey>();

  const keysQuery = useApiKeys();
  const apiKeysData = useMemo(
    () =>
      (keysQuery?.data ?? []).filter((key) => {
        return !!(key.services ?? []).find((srv) => srv.name === "pay");
      }),
    [keysQuery?.data],
  );
  const hasPayApiKeys = apiKeysData.length > 0;

  // FIXME: this seems like a deeper problem, solve later
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // query rehydrates from cache leading to stale results if user refreshes shortly after updating their dashboard.
    // Invalidate the query to force a refetch
    if (user?.address) {
      queryClient.invalidateQueries(apiKeys.keys(user?.address));
    }
  }, [queryClient, user?.address]);

  //  compute the actual selected key based on if there is a state, if there is a query param, or otherwise the first one
  const selectedKey = useMemo(() => {
    if (selectedKey_) {
      return selectedKey_;
    }
    if (apiKeysData.length) {
      return apiKeysData[0];
    }
    return undefined;
  }, [apiKeysData, selectedKey_]);

  return {
    hasPayApiKeys,
    selectedKey,
    setSelectedKey,
    apiKeysData,
    hasApiKeys: !!keysQuery.data?.length,
    isFetchingKeys: keysQuery.isFetching && !keysQuery.isRefetching,
  };
}

export default function DashboardConnectPayPage() {
  const { isLoading } = useLoggedInUser();
  const {
    hasApiKeys,
    hasPayApiKeys,
    selectedKey,
    setSelectedKey,
    apiKeysData,
    isFetchingKeys,
  } = usePayConfig();
  // Pay setting api key configuration

  if (isLoading || isFetchingKeys) {
    return (
      <div className="py-6 w-full grid place-items-center">
        <Spinner className="size-14" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-6 w-full">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
        <div className="max-w-[800px]">
          <h1 className="text-5xl tracking-tight font-bold mb-5">Pay</h1>
          <p className="text-secondary-foreground leading-7">
            Pay allows your users to purchase cryptocurrencies and execute
            transactions with their credit card or debit card, or with any token
            via cross-chain routing.{" "}
            <TrackedLink
              isExternal
              category={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/connect/pay/overview"
              label="pay-docs"
              className="!text-link-foreground"
            >
              Learn more
            </TrackedLink>
          </p>
        </div>

        <div className="w-full lg:max-w-[300px]">
          {hasPayApiKeys && selectedKey && (
            <ApiKeysMenu
              apiKeys={apiKeysData}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />
          )}
        </div>
      </div>

      <PayUI
        hasPayApiKeys={hasPayApiKeys}
        hasApiKeys={hasApiKeys}
        selectedKey={selectedKey}
      />
    </div>
  );
}

function PayUI(props: {
  hasPayApiKeys: boolean;
  hasApiKeys: boolean;
  selectedKey: ApiKey | undefined;
}) {
  const { hasPayApiKeys, hasApiKeys, selectedKey } = props;
  const [activeTab, setActiveTab] = useState<"settings" | "analytics">(
    "analytics",
  );

  return (
    <div>
      {!hasPayApiKeys && (
        <NoApiKeys
          service="Pay in Connect"
          buttonTextOverride={hasApiKeys ? "Enable Pay" : undefined}
          copyOverride={
            hasApiKeys
              ? "You'll need to enable pay as a service in an API Key to use Pay."
              : undefined
          }
        />
      )}

      {hasPayApiKeys && selectedKey && (
        <>
          <TabButtons
            tabs={[
              {
                name: "Analytics",
                isActive: activeTab === "analytics",
                onClick: () => setActiveTab("analytics"),
                isEnabled: true,
              },
              {
                name: "Settings",
                isActive: activeTab === "settings",
                onClick: () => setActiveTab("settings"),
                isEnabled: true,
              },
            ]}
          />

          <div className="h-5" />
          {/* TODO: split this into sub-pages */}
          {activeTab === "settings" && <PayConfig apiKey={selectedKey} />}
          {activeTab === "analytics" && <PayAnalytics apiKey={selectedKey} />}
        </>
      )}
    </div>
  );
}
