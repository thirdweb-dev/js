import { AppLayout } from "components/app-layouts/app";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";
import { SettingsNotificationsPage } from "../../../app/team/[team_slug]/(team)/~/settings/notifications/NotificationsPage";

const Page: ThirdwebNextPage = () => {
  return <SettingsNotificationsPage />;
};

Page.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="notifications" />
    {page}
  </AppLayout>
);

Page.pageId = PageId.SettingsNotifications;

export default Page;
