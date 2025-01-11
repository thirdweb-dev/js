"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
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
  twAccount: Account | undefined;
}

export const ContractFunctionsOverview: React.FC<ContractFunctionsOverview> = ({
  functions,
  events,
  contract,
  sources,
  abi,
  onlyFunctions,
  twAccount,
}) => {
  if (onlyFunctions) {
    return (
      <Flex height="100%" flexDir="column" gap={2}>
        {functions && functions.length > 0 && (
          <ContractFunctionsPanel
            fnsOrEvents={functions}
            contract={contract}
            twAccount={twAccount}
          />
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
                twAccount={twAccount}
              />
            </TabPanel>
          ) : null}
          {events && events?.length > 0 ? (
            <TabPanel>
              <ContractFunctionsPanel
                fnsOrEvents={events}
                contract={contract}
                twAccount={twAccount}
              />
            </TabPanel>
          ) : null}
          {abi && (
            <TabPanel>
              <div className="flex flex-col gap-6">
                <CodeOverview
                  abi={abi}
                  noSidebar
                  chainId={contract?.chain.id || 1}
                />
              </div>
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
