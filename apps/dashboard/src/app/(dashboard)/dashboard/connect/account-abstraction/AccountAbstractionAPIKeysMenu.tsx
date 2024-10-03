"use client";

import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { ApiKeysMenu } from "../../../../../components/settings/ApiKeys/Menu";

export function AccountAbstractionAPIKeysMenu(props: {
  apiKeys: Pick<ApiKey, "name" | "key">[];
  selectedAPIKey: Pick<ApiKey, "name" | "key">;
}) {
  const router = useDashboardRouter();
  return (
    <ApiKeysMenu
      apiKeys={props.apiKeys}
      selectedKey={props.selectedAPIKey}
      onSelect={(key) => {
        router.push(`/dashboard/connect/account-abstraction/${key.key}`);
      }}
    />
  );
}
