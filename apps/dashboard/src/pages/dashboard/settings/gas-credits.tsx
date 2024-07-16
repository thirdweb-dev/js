import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ApplyForOpCreditsModal } from "components/onboarding/ApplyForOpCreditsModal";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { Heading, LinkButton } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const SettingsGasCreditsPage: ThirdwebNextPage = () => {
  const { isLoading } = useLoggedInUser();

  if (isLoading) {
    return (
      <div className="grid w-full place-items-center">
        <Spinner className="size-14" />
      </div>
    );
  }

  return (
    <Flex flexDir="column" gap={8}>
      <Flex direction="row" gap={4} align="center">
        <Heading size="title.lg" as="h1">
          Apply to the Optimism Superchain App Accelerator
        </Heading>
        <LinkButton
          display={{ base: "none", md: "inherit" }}
          isExternal
          href="https://blog.thirdweb.com/accelerating-the-superchain-with-optimism/"
          size="sm"
          variant="outline"
        >
          Learn More
        </LinkButton>
      </Flex>

      <ApplyForOpCreditsModal />
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
