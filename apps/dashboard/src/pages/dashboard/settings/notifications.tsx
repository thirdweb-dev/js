import { AppLayout } from "components/app-layouts/app";
import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";
import { SettingsNotificationsPage } from "../../../app/team/[team_slug]/(team)/~/settings/notifications/NotificationsPage";
import { SettingsSidebarLayout } from "../../../core-ui/sidebar/settings";

const Page: ThirdwebNextPage = () => {
  return <SettingsNotificationsPage />;
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

Page.pageId = PageId.SettingsNotifications;

export default Page;
