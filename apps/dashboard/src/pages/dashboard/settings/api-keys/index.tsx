import { Button } from "@/components/ui/button";
import {
  AccountStatus,
  useAccount,
  useApiKeys,
} from "@3rdweb-sdk/react/hooks/useApi";
import { AppLayout } from "components/app-layouts/app";
import { ApiKeys } from "components/settings/ApiKeys";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeys/Alerts";
import { SettingsSidebarLayout } from "core-ui/sidebar/settings";
import { PlusIcon } from "lucide-react";
import { PageId } from "page-id";
import { useMemo, useState } from "react";
import { Link } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";
import { LazyCreateAPIKeyDialog } from "../../../../components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";

const SettingsApiKeysPage: ThirdwebNextPage = () => {
  const keysQuery = useApiKeys();
  const meQuery = useAccount();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const account = meQuery?.data;
  const apiKeys = keysQuery?.data;

  const hasSmartWalletsWithoutBilling = useMemo(() => {
    if (!account || !apiKeys) {
      return;
    }

    return apiKeys.find((k) =>
      k.services?.find(
        (s) =>
          account.status !== AccountStatus.ValidPayment && s.name === "bundler",
      ),
    );
  }, [apiKeys, account]);

  return (
    <div className="flex flex-col gap-8">
      <LazyCreateAPIKeyDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        wording="api-key"
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">API Keys</h1>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <PlusIcon className="size-4" />
            Create API Key
          </Button>
        </div>

        <p className="text-muted-foreground text-sm">
          An API key is required to use thirdweb&apos;s services through the SDK
          and CLI.{" "}
          <Link
            target="_blank"
            color="blue.500"
            href="https://portal.thirdweb.com/account/api-keys"
            isExternal
          >
            Learn more
          </Link>
        </p>
      </div>

      {hasSmartWalletsWithoutBilling && (
        <SmartWalletsBillingAlert dismissable />
      )}

      <ApiKeys
        keys={apiKeys || []}
        isLoading={keysQuery.isLoading}
        isFetched={keysQuery.isFetched}
      />
    </div>
  );
};

SettingsApiKeysPage.getLayout = (page, props) => (
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <SettingsSidebarLayout>{page}</SettingsSidebarLayout>
  </AppLayout>
);

SettingsApiKeysPage.pageId = PageId.SettingsApiKeys;

export default SettingsApiKeysPage;
