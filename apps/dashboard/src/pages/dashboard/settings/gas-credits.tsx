import { AppLayout } from "components/app-layouts/app";
import { SettingsSidebarLayout } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import {} from "tw-components";
import type { ThirdwebNextPage } from "utils/types";
import { SettingsGasCreditsPage } from "../../../app/team/[team_slug]/(team)/~/settings/credits/SettingsCreditsPage";

const Page: ThirdwebNextPage = () => {
  return <SettingsGasCreditsPage />;
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
