import { ContractFunctionsPanel } from "./contract-function";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import type {
  Abi,
  AbiEvent,
  AbiFunction,
  SmartContract,
} from "@thirdweb-dev/sdk";
import { SourcesPanel } from "components/contract-components/shared/sources-panel";
import { SourceFile } from "components/contract-components/types";
import { CodeOverview } from "contract-ui/tabs/code/components/code-overview";
import { Heading } from "tw-components";

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
      <Flex height="100%" flexDir="column" gap={2}>
        {functions && functions.length > 0 && (
          <ContractFunctionsPanel fnsOrEvents={functions} contract={contract} />
        )}
      </Flex>
    );
  }

  return (
    <Flex flexDir="column" gap={2} w="100%">
      <Tabs isLazy lazyBehavior="keepMounted" colorScheme="gray">
        <TabList px={0} borderBottomColor="borderColor" borderBottomWidth="1px">
          {functions && functions.length > 0 ? (
            <Tab>
              <Heading color="inherit" my={1} size="label.lg">
                Functions
              </Heading>
            </Tab>
          ) : null}
          {events?.length ? (
            <Tab>
              <Heading color="inherit" my={1} size="label.lg">
                Events
              </Heading>
            </Tab>
          ) : null}
          {abi && (
            <Tab>
              <Heading color="inherit" my={1} size="label.lg">
                Code
              </Heading>
            </Tab>
          )}
          {sources && sources?.length > 0 && (
            <Tab>
              <Heading color="inherit" my={1} size="label.lg">
                Sources
              </Heading>
            </Tab>
          )}
        </TabList>
        <TabPanels py={2}>
          {functions && functions.length > 0 ? (
            <TabPanel h="40rem">
              <ContractFunctionsPanel
                fnsOrEvents={functions}
                contract={contract}
              />
            </TabPanel>
          ) : null}
          {events && events?.length > 0 ? (
            <TabPanel>
              <ContractFunctionsPanel
                fnsOrEvents={events}
                contract={contract}
              />
            </TabPanel>
          ) : null}
          {abi && (
            <TabPanel>
              <Flex direction="column" gap={6}>
                <CodeOverview abi={abi} noSidebar />
              </Flex>
            </TabPanel>
          )}
          {(sources || abi) && (
            <TabPanel>
              <SourcesPanel sources={sources} abi={abi} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
