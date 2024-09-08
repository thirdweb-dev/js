import { AppLayout } from "components/app-layouts/app";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";
import { SettingsBillingPage } from "../../../app/team/[team_slug]/(team)/~/settings/billing/BillingSettingsPage";

const Page: ThirdwebNextPage = () => {
  return <SettingsBillingPage />;
};

Page.pageId = PageId.SettingsUsage;

Page.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="billing" />

    {page}
  </AppLayout>
);

export default Page;
