import { AppLayout } from "components/app-layouts/app";
import { SettingsSidebarLayout } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";
import { SettingsBillingPage } from "../../../app/team/[team_slug]/(team)/~/settings/billing/BillingSettingsPage";

const Page: ThirdwebNextPage = () => {
  return <SettingsBillingPage teamId={undefined} />;
};

Page.pageId = PageId.SettingsUsage;

Page.getLayout = (page, props) => (
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <SettingsSidebarLayout>{page}</SettingsSidebarLayout>
  </AppLayout>
);

export default Page;
