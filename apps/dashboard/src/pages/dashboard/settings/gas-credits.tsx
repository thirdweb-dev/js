import { AppLayout } from "components/app-layouts/app";
import { Flex } from "@chakra-ui/react";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { Heading } from "tw-components";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { ApplyForOpCreditsModal } from "../../../components/onboarding/ApplyForOpCreditsModal";

const SettingsGasCreditsPage: ThirdwebNextPage = () => {
  const { isLoggedIn } = useLoggedInUser();

  if (!isLoggedIn) {
    return <ConnectWalletPrompt description="gas credits" />;
  }

  return (
    <Flex flexDir="column" gap={8}>
      <Heading size="title.lg" as="h1">
        Apply for Gas Credits
      </Heading>
      <ApplyForOpCreditsModal isOpen onClose={() => {}} noModal />
    </Flex>
  );
};

SettingsGasCreditsPage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="gas-credits" />
    {page}
  </AppLayout>
);

SettingsGasCreditsPage.pageId = PageId.SettingsUsage;

export default SettingsGasCreditsPage;
