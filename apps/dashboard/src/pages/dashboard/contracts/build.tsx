import { Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ContractsSidebar } from "core-ui/sidebar/contracts";
import { PageId } from "page-id";
import {
  Heading,
  Text,
  TrackedLink,
  CodeBlock,
  TrackedLinkButton,
} from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "dashboard-contract-build";

const DashboardContractsBuild: ThirdwebNextPage = () => {
  return (
    <Flex flexDir="column" gap={4}>
      <Heading as="h1" size="title.lg">
        Build
      </Heading>
      <Text>
        Build custom smart contracts efficiently by using prebuilt base
        contracts and a set of reusable components, or extensions, that can be
        integrated into smart contracts.
      </Text>
      <UnorderedList>
        <Text as={ListItem}>
          <TrackedLink
            category={TRACKING_CATEGORY}
            label="base-contracts"
            href="https://portal.thirdweb.com/contracts/build/base-contracts"
            color="blue.500"
          >
            Base contracts
          </TrackedLink>{" "}
          are prebuilt smart contracts that you can build on top of or modify,
          e.g. ERC721, ERC1155, ERC20. These contracts work out-of-the-box and
          do not require any functions to be implemented.
        </Text>
        <Text as={ListItem}>
          <TrackedLink
            category={TRACKING_CATEGORY}
            label="extensions"
            href="https://portal.thirdweb.com/contracts/build/extensions"
            color="blue.500"
          >
            Extensions
          </TrackedLink>{" "}
          are Solidity interfaces and industry standards that are recognizable
          by the Dashboard and unlock functionality in the SDKs. They are
          composable pieces of logic that can be added to base contracts easily.
        </Text>
      </UnorderedList>
      <Flex direction="column" gap={4}>
        <Flex gap={1} align="center" direction={{ base: "column", md: "row" }}>
          <Heading size="label.md" as="h4">
            Create a contract with a single command.
          </Heading>
          <TrackedLinkButton
            category={TRACKING_CATEGORY}
            label="learn-more"
            fontWeight={400}
            _light={{ color: "blue.500", _hover: { color: "blue.500" } }}
            _dark={{ color: "blue.400", _hover: { color: "blue.500" } }}
            size="sm"
            href="https://portal.thirdweb.com/contracts/build/overview"
            isExternal
            variant="link"
          >
            Learn more about the Solidity SDK
          </TrackedLinkButton>
        </Flex>

        <CodeBlock
          code="npx thirdweb create contract"
          language="bash"
          prefix="$"
        />
      </Flex>
    </Flex>
  );
};

DashboardContractsBuild.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <ContractsSidebar activePage="build" />
    {page}
  </AppLayout>
);
DashboardContractsBuild.pageId = PageId.DashboardContractsBuild;

export default DashboardContractsBuild;
