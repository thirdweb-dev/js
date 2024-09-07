import { AppLayout } from "components/app-layouts/app";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";
import { SettingsUsagePage } from "../../../app/team/[team_slug]/(team)/~/usage/UsagePage";

const Page: ThirdwebNextPage = () => {
  return <SettingsUsagePage />;
};

Page.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="usage" />
    {page}
  </AppLayout>
);

Page.pageId = PageId.SettingsUsage;

export default Page;
