import {
  EngineInstance,
  useEngineInstances,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Divider, Flex, Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { Heading, Text, TrackedLink } from "tw-components";
import { CreateEngineInstanceButton } from "./create-engine-instance";
import { EngineInstancesTable } from "./engine-instances-table";
import { ImportEngineInstanceButton } from "./import-engine-instance";
import { EngineOverviewDescription } from "./overview/engine-description";

interface EngineInstancesListProps {
  setConnectedInstance: Dispatch<SetStateAction<EngineInstance | undefined>>;
}

export const EngineInstancesList = ({
  setConnectedInstance,
}: EngineInstancesListProps) => {
  const instancesQuery = useEngineInstances();

  return (
    <Stack spacing={8}>
      <Stack>
        <Heading size="title.lg" as="h1">
          Engine
        </Heading>
        <Text>
          Engine is a backend HTTP server that calls smart contracts with your
          backend wallets. Reliably send blockchain transactions, manage smart
          wallets, enable gasless transactions, and more.{" "}
          <TrackedLink
            href="https://portal.thirdweb.com/infrastructure/engine/overview"
            isExternal
            category="engine"
            label="clicked-learn-more"
            color="blue.500"
          >
            Learn more about Engine
          </TrackedLink>
          .
        </Text>
      </Stack>

      <Stack spacing={4}>
        {instancesQuery.data && instancesQuery.data.length === 0 ? (
          <>
            <Divider />

            <Flex
              direction={{ base: "column", md: "row" }}
              gap={3}
              justify="space-between"
            >
              <Stack>
                <Heading size="title.sm">Get Started</Heading>
                <Text>
                  Create or import an Engine instance to manage it from this
                  dashboard.
                </Text>
              </Stack>
              <Flex direction={{ base: "column-reverse", md: "row" }} gap={3}>
                <ImportEngineInstanceButton refetch={instancesQuery.refetch} />
                <CreateEngineInstanceButton refetch={instancesQuery.refetch} />
              </Flex>
            </Flex>
            <EngineOverviewDescription />
          </>
        ) : (
          <>
            <Divider />

            <Flex
              direction={{ base: "column", md: "row" }}
              gap={3}
              justify="flex-end"
            >
              <Flex direction={{ base: "column-reverse", md: "row" }} gap={3}>
                <ImportEngineInstanceButton refetch={instancesQuery.refetch} />
                <CreateEngineInstanceButton refetch={instancesQuery.refetch} />
              </Flex>
            </Flex>

            <EngineInstancesTable
              instances={instancesQuery.data ?? ([] as EngineInstance[])}
              isFetched={instancesQuery.isFetched}
              isLoading={instancesQuery.isLoading}
              refetch={instancesQuery.refetch}
              setConnectedInstance={setConnectedInstance}
            />
          </>
        )}
      </Stack>
    </Stack>
  );
};
