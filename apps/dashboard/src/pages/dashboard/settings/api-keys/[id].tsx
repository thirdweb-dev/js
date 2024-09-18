import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { AppLayout } from "components/app-layouts/app";
import { SettingsSidebarLayout } from "core-ui/sidebar/settings";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useEffect, useMemo } from "react";
import type { ThirdwebNextPage } from "utils/types";
import { ProjectGeneralSettingsPage } from "../../../../app/team/[team_slug]/[project_slug]/settings/ProjectGeneralSettingsPage";

const SettingsApiKeyPage: ThirdwebNextPage = () => {
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

  if (!user || !apiKey) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <Link
          href="/dashboard/settings/api-keys"
          className="text-muted-foreground hover:text-foreground"
        >
          API Keys
        </Link>

        <span aria-hidden>
          <ChevronRightIcon className="size-4 text-muted-foreground/80" />
        </span>

        <span className="text-foreground">{apiKey.name}</span>
      </div>

      <ProjectGeneralSettingsPage
        apiKey={apiKey}
        paths={{
          inAppConfig: `/dashboard/wallets/embedded?tab=1&clientId=${apiKey.key}`,
          aaConfig: `/dashboard/wallets/smart-wallet?tab=1&clientId=${apiKey.key}`,
          payConfig: `/dashboard/connect/pay/${apiKey.id}/settings`,
          afterDeleteRedirectTo: "/dashboard/settings/api-keys",
        }}
        onKeyUpdated={undefined}
        wording="api-key"
      />
    </div>
  );
};

SettingsApiKeyPage.getLayout = (page, props) => (
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <SettingsSidebarLayout>{page}</SettingsSidebarLayout>
  </AppLayout>
);

SettingsApiKeyPage.pageId = PageId.SettingsApiKey;

export default SettingsApiKeyPage;
