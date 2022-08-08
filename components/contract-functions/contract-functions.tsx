import { ContractFunctionsPanel } from "./contract-function";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import type { AbiFunction, SmartContract } from "@thirdweb-dev/sdk";
import {
  SourceFile,
  SourcesPanel,
} from "components/contract-components/released-contract/sources-panel";
import { useMemo } from "react";
import { Card, Heading } from "tw-components";

interface ContractFunctionsOverview {
  functions: AbiFunction[];
  contract?: SmartContract;
  sources?: SourceFile[];
}

export const ContractFunctionsOverview: React.FC<ContractFunctionsOverview> = ({
  functions,
  contract,
  sources,
}) => {
  const { fns, vars } = useMemo(() => {
    return {
      fns: functions.filter((fn) => fn.stateMutability !== "pure"),
      vars: functions.filter((fn) => fn.stateMutability === "pure"),
    };
  }, [functions]);

  return (
    <Card as={Flex} flexDir="column" gap={2} p={0}>
      <Tabs isLazy lazyBehavior="keepMounted" colorScheme="purple">
        <TabList px={0} borderBottomColor="borderColor" borderBottomWidth="1px">
          {fns.length ? (
            <Tab gap={2}>
              <Heading color="inherit" my={1} size="label.lg">
                Functions
              </Heading>
            </Tab>
          ) : null}
          {vars.length ? (
            <Tab gap={2}>
              <Heading color="inherit" my={1} size="label.lg">
                Variables
              </Heading>
            </Tab>
          ) : null}
          <Tab isDisabled gap={2}>
            <Heading color="inherit" my={1} size="label.lg">
              Events 🚧
            </Heading>
          </Tab>
          {sources && (
            <Tab gap={2}>
              <Heading color="inherit" my={1} size="label.lg">
                Sources
              </Heading>
            </Tab>
          )}
        </TabList>
        <TabPanels px={{ base: 2, md: 6 }} py={2}>
          {fns.length ? (
            <TabPanel px={0}>
              <ContractFunctionsPanel functions={fns} contract={contract} />
            </TabPanel>
          ) : null}
          {vars.length ? (
            <TabPanel px={0}>
              <ContractFunctionsPanel functions={vars} contract={contract} />
            </TabPanel>
          ) : null}
          <TabPanel px={0}>
            <div>Events panel will go here</div>
          </TabPanel>
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
