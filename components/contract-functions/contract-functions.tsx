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
import { SourcesPanel } from "components/contract-components/shared/sources-panel";
import { Abi, SourceFile } from "components/contract-components/types";
import { Card, Heading } from "tw-components";

interface ContractFunctionsOverview {
  functions?: AbiFunction[] | null;
  events?: AbiEvent[] | null;
  contract?: SmartContract;
  sources?: SourceFile[];
  abi?: Abi;
  onlyFunctions?: boolean;
}

export const ContractFunctionsOverview: React.FC<ContractFunctionsOverview> = ({
  functions,
  events,
  contract,
  sources,
  abi,
  onlyFunctions,
}) => {
  if (onlyFunctions) {
    return (
      <Card as={Flex} flexDir="column" gap={2}>
        {functions && functions.length > 0 && (
          <ContractFunctionsPanel fnsOrEvents={functions} contract={contract} />
        )}
      </Card>
    );
  }

  return (
    <Card as={Flex} flexDir="column" gap={2} p={0}>
      <Tabs isLazy lazyBehavior="keepMounted" colorScheme="purple">
        <TabList px={0} borderBottomColor="borderColor" borderBottomWidth="1px">
          {functions && functions.length > 0 ? (
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
          {sources && sources?.length > 0 && (
            <Tab gap={2}>
              <Heading color="inherit" my={1} size="label.lg">
                Sources
              </Heading>
            </Tab>
          )}
        </TabList>
        <TabPanels px={{ base: 2, md: 6 }} py={2}>
          {functions && functions.length > 0 ? (
            <TabPanel px={0}>
              <ContractFunctionsPanel
                fnsOrEvents={functions}
                contract={contract}
              />
            </TabPanel>
          ) : null}
          {events && events?.length > 0 ? (
            <TabPanel px={0}>
              <ContractFunctionsPanel
                fnsOrEvents={events}
                contract={contract}
              />
            </TabPanel>
          ) : null}
          {(sources || abi) && (
            <TabPanel px={0}>
              <SourcesPanel sources={sources} abi={abi} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Card>
  );
};
