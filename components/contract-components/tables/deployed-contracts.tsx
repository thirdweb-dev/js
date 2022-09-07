import { NoContracts } from "../shared/no-contracts";
import { OldProjects } from "./old-projects";
import { useAllContractList } from "@3rdweb-sdk/react";
import { useProjects } from "@3rdweb-sdk/react/hooks/useProjects";
import {
  Center,
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ContractTable } from "pages/dashboard";
import { useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { Heading, LinkButton, Text } from "tw-components";

interface DeployedContractsProps {
  address?: string;
  noHeader?: boolean;
  noProjects?: boolean;
  contractListQuery: ReturnType<typeof useAllContractList>;
}

export const DeployedContracts: React.FC<DeployedContractsProps> = ({
  address,
  noHeader,
  noProjects,
  contractListQuery,
}) => {
  const router = useRouter();

  const projectsQuery = useProjects(address);

  useEffect(() => {
    if (
      contractListQuery.isFetched &&
      contractListQuery.data.length === 0 &&
      projectsQuery.data?.length === 0 &&
      router.asPath === "/dashboard"
    ) {
      router.replace("/contracts");
    }
  }, [contractListQuery, router, projectsQuery]);

  return (
    <>
      {!noHeader && (
        <Flex
          justify="space-between"
          align="top"
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <Flex gap={2} direction="column">
            <Heading size="title.md">Deployed contracts</Heading>
            <Text fontStyle="italic" maxW="container.md">
              The list of contract instances that you have deployed with
              thirdweb across all networks.
            </Text>
          </Flex>
          <LinkButton
            leftIcon={<FiPlus />}
            colorScheme="primary"
            href="/contracts"
          >
            Deploy new contract
          </LinkButton>
        </Flex>
      )}
      {!noProjects && projectsQuery && projectsQuery?.data?.length ? (
        <>
          <Tabs>
            <TabList>
              <Tab>V2 Contracts</Tab>
              <Tab>V1 Projects</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0} pt={8}>
                {contractListQuery.data.length === 0 ? (
                  <NoContracts />
                ) : (
                  <ContractTable combinedList={contractListQuery.data} />
                )}
              </TabPanel>
              <TabPanel px={0} pt={8}>
                <OldProjects projects={projectsQuery.data} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      ) : (
        <ContractTable combinedList={contractListQuery.data}>
          {contractListQuery.isLoading && (
            <Center>
              <Flex py={4} direction="row" gap={4} align="center">
                <Spinner size="sm" />
                <Text>Loading deployments</Text>
              </Flex>
            </Center>
          )}
          {contractListQuery.data.length === 0 && contractListQuery.isFetched && (
            <Center>
              <Flex py={4} direction="column" gap={4} align="center">
                <Text>No deployments found.</Text>
              </Flex>
            </Center>
          )}
        </ContractTable>
      )}
    </>
  );
};
