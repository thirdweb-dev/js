import { AppLayout } from "components/app-layouts/app";
import { SettingsSidebarLayout } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";
import { SettingsUsagePage } from "../../../app/team/[team_slug]/(team)/~/usage/UsagePage";

const Page: ThirdwebNextPage = () => {
  return <SettingsUsagePage />;
};

Page.getLayout = (page, props) => (
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <SettingsSidebarLayout>{page}</SettingsSidebarLayout>
  </AppLayout>
);

Page.pageId = PageId.SettingsUsage;

export default Page;
