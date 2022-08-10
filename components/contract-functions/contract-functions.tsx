import { ContractFunctionsPanel } from "./contract-function";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import type { AbiEvent, AbiFunction, SmartContract } from "@thirdweb-dev/sdk";
import {
  SourceFile,
  SourcesPanel,
} from "components/contract-components/released-contract/sources-panel";
import { Card, Heading } from "tw-components";

interface ContractFunctionsOverview {
  functions: AbiFunction[];
  events?: AbiEvent[] | null;
  contract?: SmartContract;
  sources?: SourceFile[];
}

export const ContractFunctionsOverview: React.FC<ContractFunctionsOverview> = ({
  functions,
  events,
  contract,
  sources,
}) => {
  return (
    <Card as={Flex} flexDir="column" gap={2} p={0}>
      <Tabs isLazy lazyBehavior="keepMounted" colorScheme="purple">
        <TabList px={0} borderBottomColor="borderColor" borderBottomWidth="1px">
          {functions.length ? (
            <Tab gap={2}>
              <Heading color="inherit" my={1} size="label.lg">
                Functions
              </Heading>
            </Tab>
          ) : null}
          {events?.length ? (
            <Tab gap={2}>
              <Heading color="inherit" my={1} size="label.lg">
                Events
              </Heading>
            </Tab>
          ) : null}
          {sources && (
            <Tab gap={2}>
              <Heading color="inherit" my={1} size="label.lg">
                Sources
              </Heading>
            </Tab>
          )}
        </TabList>
        <TabPanels px={{ base: 2, md: 6 }} py={2}>
          {functions.length ? (
            <TabPanel px={0}>
              <ContractFunctionsPanel
                fnsOrEvents={functions}
                contract={contract}
              />
            </TabPanel>
          ) : null}
          {events?.length ? (
            <TabPanel px={0}>
              <ContractFunctionsPanel
                fnsOrEvents={events}
                contract={contract}
              />
            </TabPanel>
          ) : null}
          {sources && (
            <TabPanel px={0}>
              <SourcesPanel sources={sources} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Card>
  );
};
