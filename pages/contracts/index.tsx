import { Box, Flex, Icon } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { ReleasedContractTable } from "components/contract-components/contract-table-v2";
import { usePublishedContractsQuery } from "components/contract-components/hooks";
import { GettingStartedBox } from "components/getting-started/box";
import { GettingStartedCard } from "components/getting-started/card";
import { BuiltinContractMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import { ReactElement, useMemo } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  Card,
  CodeBlock,
  Heading,
  LinkButton,
  Text,
  TrackedLink,
} from "tw-components";

const Contracts: ThirdwebNextPage = () => {
  const walletAddress = useAddress();
  const releasedContractsQuery = usePublishedContractsQuery(walletAddress);

  const prebuiltContracts = Object.values(BuiltinContractMap).filter(
    (contract) => contract.contractType !== "custom",
  );
  const releasedContracts = useMemo(
    () => releasedContractsQuery.data || [],
    [releasedContractsQuery],
  );

  const allContracts = useMemo(
    () => [...releasedContracts, ...prebuiltContracts],

    [prebuiltContracts, releasedContracts],
  );

  return (
    <Flex gap={8} direction="column">
      <GettingStartedBox
        title="Begin your journey with building contracts"
        description="Which best describes your contract needs?"
        storageId="contract"
      >
        <GettingStartedCard
          title="I want to get started with a prebuilt contract"
          description={
            <>
              Browse our selection of secure, gas-optimized, and audited
              contracts that are ready to be deployed with one-click.
            </>
          }
          icon={require("public/assets/product-icons/contracts.png")}
          linkProps={{
            category: "getting-started",
            label: "browse-contracts",
            href: "#release-contract-table",
            children: (
              <>
                Get Started <Icon as={FiArrowRight} />
              </>
            ),
          }}
        />
        <GettingStartedCard
          title="I want to build my own customized contract"
          description={
            <>
              Get started with <b>ContractKit</b> to create custom contracts
              that is specific to your use case.
            </>
          }
          icon={require("public/assets/product-icons/extensions.png")}
          linkProps={{
            category: "getting-started",
            label: "custom-contracts",
            href: "https://portal.thirdweb.com/contractkit",
            isExternal: true,
            children: (
              <>
                View Docs <Icon as={FiArrowRight} />
              </>
            ),
          }}
        />
        <GettingStartedCard
          title="I already have an existing contract"
          description={
            <>
              You are ready to deploy your contract with our interactive{" "}
              <b>CLI</b>.
            </>
          }
          icon={require("public/assets/product-icons/deploy.png")}
        >
          <CodeBlock
            mt="auto"
            language="bash"
            code="npx thirdweb@latest deploy"
          />
        </GettingStartedCard>
      </GettingStartedBox>
      <Heading>Contracts</Heading>
      <Text fontStyle="italic">
        A combination of our{" "}
        <TrackedLink
          category="contracts"
          label="pre-built"
          href="https://portal.thirdweb.com/pre-built-contracts"
          isExternal
          color="blue.500"
        >
          prebuilt contracts
        </TrackedLink>{" "}
        and your{" "}
        <TrackedLink
          category="contracts"
          label="released"
          href="https://portal.thirdweb.com/release"
          isExternal
          color="blue.500"
        >
          released contracts
        </TrackedLink>
        . Not sure which contract is right for your use-case?{" "}
        <TrackedLink
          category="contracts"
          label="take-quiz"
          href="https://portal.thirdweb.com/pre-built-contracts/choosing-the-right-pre-built-contract"
          isExternal
          color="blue.500"
        >
          Help me choose.
        </TrackedLink>
      </Text>
      <Box id="release-contract-table">
        <ReleasedContractTable
          contractDetails={allContracts}
          isFetching={releasedContractsQuery.isFetching}
        />
      </Box>

      <Card
        bg="backgroundHighlight"
        p={8}
        outlineBorder={{
          gradient: "linear(147.15deg, #410AB6 30.17%, #E85CFF 100%)",
          width: "5px",
        }}
      >
        <Flex
          gap={4}
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
        >
          <Flex gap={6} direction="column">
            <Heading size="title.md">
              Don&apos;t see the contract you want? Deploy your own!
            </Heading>

            <Box>
              <CodeBlock code="npx thirdweb@latest deploy" language="bash" />
            </Box>
          </Flex>
          <LinkButton
            colorScheme="purple"
            w={{ base: "full", md: "auto" }}
            isExternal
            href="https://portal.thirdweb.com/deploy"
            size="md"
          >
            Learn more
          </LinkButton>
        </Flex>
      </Card>
    </Flex>
  );
};

Contracts.getLayout = (page: ReactElement) => (
  <AppLayout>
    <PublisherSDKContext>{page}</PublisherSDKContext>
  </AppLayout>
);

Contracts.pageId = PageId.Contracts;

export default Contracts;
