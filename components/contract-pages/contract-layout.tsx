import { ContractEmptyState, IContractEmptyState } from "./contract-emptystate";
import { ContractHeader } from "./contract-header";
import { useWeb3 } from "@3rdweb-sdk/react";
import {
  Box,
  Center,
  Container,
  HStack,
  Heading,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { ValidContractClass } from "@thirdweb-dev/sdk";
import { ContractTab, useContractTabs } from "components/contract-tabs";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useMemo } from "react";
import { UseQueryResult } from "react-query";
import { C } from "ts-toolbelt";
import { parseErrorToMessage } from "utils/errorParser";
import { removeNull } from "utils/removeNull";
import { z } from "zod";

interface IContractLayoutProps<
  TContract extends ValidContractClass,
  TMetadata extends z.infer<TContract["schema"]["output"]> | undefined,
  TData,
> {
  contract?: C.Instance<TContract>;
  metadata: UseQueryResult<TMetadata>;
  data?: UseQueryResult<TData>;
  // Type shouldn't be enforced on primaryAction props?
  primaryAction?: React.ElementType<any>;
  secondaryAction?: JSX.Element;
  tertiaryAction?: JSX.Element;
  emptyState?: IContractEmptyState;
}

export const ContractLayout = <
  TContract extends ValidContractClass,
  TMetadata extends z.infer<TContract["schema"]["output"]> | undefined,
  TData,
>({
  contract,
  metadata,
  data,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  children,
  emptyState,
}: PropsWithChildren<IContractLayoutProps<TContract, TMetadata, TData>>) => {
  const router = useRouter();
  const { address } = useWeb3();
  const tabs = useContractTabs(contract);
  const tabIndex = parseInt(useSingleQueryParam("tabIndex") || "0");
  const activeTab = useMemo(() => {
    if (tabIndex > tabs.length) {
      return tabs.length;
    } else if (tabIndex < 0) {
      return 0;
    }
    return tabIndex;
  }, [tabIndex, tabs]);

  const PrimaryActionButton = useMemo(() => {
    return primaryAction;
  }, [primaryAction]);

  // handle metadata still loading
  if (metadata.isLoading || !metadata.data) {
    return (
      <Center p={16}>
        <HStack>
          <Spinner size="sm" />
          <Text>Loading Contract...</Text>
        </HStack>
      </Center>
    );
  }
  // handle metadata error (probably the contract doesn't exist)
  if (metadata.isError && metadata.error && metadata.error instanceof Error) {
    return (
      <Center>
        <Container>
          <Heading as="h1" size="xl">
            {parseErrorToMessage(metadata.error)}
          </Heading>
        </Container>
      </Center>
    );
  }

  return (
    <Stack spacing={8}>
      <ContractHeader
        contract={contract}
        contractMetadata={metadata.data}
        primaryAction={
          PrimaryActionButton && (
            <PrimaryActionButton
              colorScheme="primary"
              contract={contract}
              account={removeNull(address)}
            />
          )
        }
        secondaryAction={secondaryAction}
        tertiaryAction={tertiaryAction}
      />
      <Tabs index={activeTab} isLazy>
        <TabList
          overflowY="visible"
          overflowX={{ base: "scroll", md: "inherit" }}
        >
          <Tab
            onClick={() =>
              router.push({ query: { ...router.query, tabIndex: 0 } })
            }
          >
            <Heading color="inherit" as="h4" size="label.lg">
              Overview
            </Heading>
          </Tab>
          {tabs?.map((contractTab: ContractTab, index: number) => (
            <Tab
              key={contractTab.title}
              onClick={() =>
                router.push({ query: { ...router.query, tabIndex: index + 1 } })
              }
            >
              <Heading color="inherit" as="h4" size="label.lg">
                {contractTab.title}
              </Heading>
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Box minH="50vh" position="relative">
              {data && data.isRefetching && (
                <Spinner
                  color="primary"
                  size="xs"
                  position="absolute"
                  top={2}
                  right={4}
                />
              )}
              {!data ? (
                children
              ) : data.isLoading ? (
                <Center position="absolute" w="full" h="full" top={0} left={0}>
                  <HStack>
                    <Spinner size="sm" />
                    <Text>Loading Contract Data...</Text>
                  </HStack>
                </Center>
              ) : (!data.data ||
                  (Array.isArray(data.data) && data.data.length === 0)) &&
                emptyState ? (
                <ContractEmptyState {...emptyState} />
              ) : (
                children
              )}
            </Box>
          </TabPanel>
          {tabs?.map((contractTab: ContractTab) => (
            <TabPanel px={0} key={contractTab.title}>
              {contractTab.content}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
