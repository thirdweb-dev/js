import { useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { AppLayout } from "components/app-layouts/app";
import { ApiKeyDetails } from "components/settings/ApiKeys/Details";
import { EditApiKey } from "components/settings/ApiKeys/Edit";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useEffect, useMemo, useState } from "react";
import type { ThirdwebNextPage } from "utils/types";

const SettingsApiKeyPage: ThirdwebNextPage = () => {
  const [editing, setEditing] = useState(false);
  const keysQuery = useApiKeys();
  const router = useRouter();
  const { user } = useLoggedInUser();

  const apiKey = useMemo(() => {
    return keysQuery.data?.find((key) => key.id === router.query.id);
  }, [keysQuery?.data, router.query.id]);

  // legitimate use-case, however with move to RSCs this will happen in the RSC logic later
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (keysQuery.isSuccess && !apiKey) {
      router.push("/dashboard/settings/api-keys");
    }
  }, [apiKey, keysQuery.isSuccess, router]);

  if (!user) {
    return null;
  }

  if (!apiKey) {
    return null;
  }

  return editing ? (
    <EditApiKey apiKey={apiKey} onCancel={() => setEditing(false)} />
  ) : (
    <ApiKeyDetails apiKey={apiKey} onEdit={() => setEditing(true)} />
  );
};

SettingsApiKeyPage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="apiKey" />
    {page}
  </AppLayout>
);

SettingsApiKeyPage.pageId = PageId.SettingsApiKey;

export default SettingsApiKeyPage;
