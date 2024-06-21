import {
  type EngineInstance,
  useEngineInstances,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Center,
  Divider,
  Flex,
  Icon,
  ListItem,
  Stack,
  UnorderedList,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import type { Dispatch, SetStateAction } from "react";
import { VscBook } from "react-icons/vsc";
import { Card, Heading, Link, Text } from "tw-components";
import { CreateEngineInstanceButton } from "./create-engine-instance";
import { EngineInstancesTable } from "./engine-instances-table";
import { ImportEngineInstanceButton } from "./import-engine-instance";

interface EngineInstancesListProps {
  setConnectedInstance: Dispatch<SetStateAction<EngineInstance | undefined>>;
}

export const EngineInstancesList = ({
  setConnectedInstance,
}: EngineInstancesListProps) => {
  const instancesQuery = useEngineInstances();
  const instances = instancesQuery.data ?? [];

  return (
    <Stack spacing={8}>
      {instances.length === 0 ? (
        <Center>
          <Stack spacing={8}>
            <ChakraNextImage
              alt="Engine hero image"
              src={require("../../../public/assets/engine/empty-state-header.png")}
              maxW={650}
            />
            <Heading size="title.lg" as="h1">
              Your scalable web3 backend server
            </Heading>

            <UnorderedList color="gray.600">
              <ListItem>
                Read, write, and deploy contracts at production scale
              </ListItem>
              <ListItem>
                Reliably parallelize and retry transactions with gas &amp; nonce
                management
              </ListItem>
              <ListItem>Securely manage backend wallets</ListItem>
              <ListItem>
                Built-in support for account abstraction, relayers, and more
              </ListItem>
            </UnorderedList>

            <Flex gap={4}>
              <CreateEngineInstanceButton
                ctaText="Get Started"
                refetch={instancesQuery.refetch}
              />
              <ImportEngineInstanceButton refetch={instancesQuery.refetch} />
            </Flex>
          </Stack>
        </Center>
      ) : (
        <>
          <Stack>
            <Heading size="title.lg" as="h1">
              Engine
            </Heading>
          </Stack>

          <Stack spacing={4}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={3}
              justify="flex-end"
            >
              <Flex direction={{ base: "column-reverse", md: "row" }} gap={3}>
                <ImportEngineInstanceButton refetch={instancesQuery.refetch} />
                <CreateEngineInstanceButton
                  ctaText="Create Engine Instance"
                  refetch={instancesQuery.refetch}
                />
              </Flex>
            </Flex>

            <EngineInstancesTable
              instances={instancesQuery.data ?? ([] as EngineInstance[])}
              isFetched={instancesQuery.isFetched}
              isLoading={instancesQuery.isLoading}
              refetch={instancesQuery.refetch}
              setConnectedInstance={setConnectedInstance}
            />
          </Stack>
        </>
      )}

      <Divider />

      <Card p={8}>
        <Stack>
          <Flex gap={2} align="center">
            <Icon as={VscBook} />
            <Heading size="title.xs">Learn more about Engine</Heading>
          </Flex>
          <Text>Dive into features and integration guides.</Text>
          <Link
            href="https://portal.thirdweb.com/engine"
            isExternal
            color="blue.500"
            fontSize="small"
          >
            View Docs &rarr;
          </Link>
        </Stack>
      </Card>
    </Stack>
  );
};
