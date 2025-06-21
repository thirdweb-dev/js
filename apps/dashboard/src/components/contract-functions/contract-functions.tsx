"use client";

import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import type { Abi, AbiEvent, AbiFunction } from "abitype";
import { SourcesPanel } from "components/contract-components/shared/sources-panel";
import type { SourceFile } from "components/contract-components/types";
import { CodeOverview } from "contract-ui/tabs/code/components/code-overview";
import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";
import { ContractFunctionsPanel } from "./contract-function";

interface ContractFunctionsOverview {
  functions?: AbiFunction[] | null;
  events?: AbiEvent[] | null;
  contract?: ThirdwebContract;
  sources?: SourceFile[];
  abi?: Abi;
  onlyFunctions?: boolean;
  isLoggedIn: boolean;
}

export const ContractFunctionsOverview: React.FC<ContractFunctionsOverview> = ({
  functions,
  events,
  contract,
  sources,
  abi,
  onlyFunctions,
  isLoggedIn,
}) => {
  if (onlyFunctions) {
    return (
      <Flex flexDir="column" gap={2} height="100%">
        {functions && functions.length > 0 && (
          <ContractFunctionsPanel
            contract={contract}
            fnsOrEvents={functions}
            isLoggedIn={isLoggedIn}
          />
        )}
      </Flex>
    );
  }

  return (
    <Flex flexDir="column" gap={2} w="100%">
      <Tabs colorScheme="gray" isLazy lazyBehavior="keepMounted">
        <TabList borderBottomColor="borderColor" borderBottomWidth="1px" px={0}>
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
                contract={contract}
                fnsOrEvents={functions}
                isLoggedIn={isLoggedIn}
              />
            </TabPanel>
          ) : null}
          {events && events?.length > 0 ? (
            <TabPanel>
              <ContractFunctionsPanel
                contract={contract}
                fnsOrEvents={events}
                isLoggedIn={isLoggedIn}
              />
            </TabPanel>
          ) : null}
          {abi && (
            <TabPanel>
              <div className="flex flex-col gap-6">
                <CodeOverview
                  abi={abi}
                  chainId={contract?.chain.id || 1}
                  noSidebar
                />
              </div>
            </TabPanel>
          )}
          {(sources || abi) && (
            <TabPanel>
              <SourcesPanel abi={abi} sources={sources} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
