import { AppLayout } from "components/app-layouts/app";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import {} from "tw-components";
import type { ThirdwebNextPage } from "utils/types";
import { SettingsGasCreditsPage } from "../../../app/team/[team_slug]/(team)/~/settings/credits/SettingsCreditsPage";

const Page: ThirdwebNextPage = () => {
  return <SettingsGasCreditsPage />;
};

Page.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="gas-credits" />
    {page}
  </AppLayout>
);

Page.pageId = PageId.SettingsUsage;

export default Page;
