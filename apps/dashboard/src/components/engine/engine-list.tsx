import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
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
import { useTrack } from "hooks/analytics/useTrack";
import type { Dispatch, SetStateAction } from "react";
import { VscBook } from "react-icons/vsc";
import invariant from "tiny-invariant";
import { Button, Card, Heading, Link, Text } from "tw-components";
import { CreateEngineInstanceButton } from "./create-engine-instance";
import { EngineInstancesTable } from "./engine-instances-table";
import { ImportEngineInstanceButton } from "./import-engine-instance";

interface EngineInstancesListProps {
  setConnectedInstance: Dispatch<SetStateAction<EngineInstance | undefined>>;
}

export const EngineInstancesList = ({
  setConnectedInstance,
}: EngineInstancesListProps) => {
  invariant(
    process.env.NEXT_PUBLIC_DEMO_ENGINE_URL,
    "missing NEXT_PUBLIC_DEMO_ENGINE_URL",
  );
  const NEXT_PUBLIC_DEMO_ENGINE_URL = process.env.NEXT_PUBLIC_DEMO_ENGINE_URL;

  const { data } = useAccount();
  const instancesQuery = useEngineInstances();
  const instances = instancesQuery.data ?? [];
  const trackEvent = useTrack();

  if (instancesQuery.isLoading) {
    return (
      <div className="grid place-items-center">
        <Spinner className="size-14" />
      </div>
    );
  }
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
              <Button
                onClick={() => {
                  if (!data) return;

                  trackEvent({
                    category: "engine",
                    action: "try-demo",
                    label: "clicked-try-demo",
                  });

                  // Need to hardcode the demo engine instance details
                  // but using the signed-in user account id
                  setConnectedInstance({
                    id: "sandbox",
                    url: NEXT_PUBLIC_DEMO_ENGINE_URL,
                    name: "Demo Engine",
                    status: "active",
                    lastAccessedAt: new Date().toISOString(),
                    accountId: data.id,
                  });
                }}
                variant="outline"
                px={6}
              >
                🚀 Try Demo
              </Button>
            </Flex>
            <Flex direction="column" gap={2}>
              <Divider my="2" />
              <Text>Already have an Engine Instance?</Text>
              <ImportEngineInstanceButton refetch={instancesQuery.refetch} />
            </Flex>
          </Stack>
        </Center>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
            <h1 className="text-4xl font-bold">Engine</h1>
            <div className="flex flex-row gap-2">
              <ImportEngineInstanceButton refetch={instancesQuery.refetch} />
              <CreateEngineInstanceButton
                ctaText="Create Engine Instance"
                refetch={instancesQuery.refetch}
              />
            </div>
          </div>

          <Stack spacing={4}>
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
