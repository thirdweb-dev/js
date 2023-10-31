import { Center, Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { EngineSidebar } from "core-ui/sidebar/engine";
import { PageId } from "page-id";
import { Button, Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";
import { NoEngineInstance } from "components/engine/no-engine-instance";
import { useLocalStorage } from "hooks/useLocalStorage";
import { NoConnectedWallet } from "components/engine/no-connected-wallet";
import { useEnginePermissions } from "@3rdweb-sdk/react/hooks/useEngine";
import { EngineNavigation } from "components/engine/engine-navigation";
import { NoAuthorizedWallet } from "components/engine/no-authorized-wallet";
import { NoServerConnection } from "components/engine/no-server-connection";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";

const EngineManage: ThirdwebNextPage = () => {
  const [instanceUrl, setInstanceUrl] = useLocalStorage("engine-instance", "");
  const setInstanceDisclosure = useDisclosure();
  const { isLoggedIn } = useLoggedInUser();

  const enginePermissions = useEnginePermissions(instanceUrl);

  return (
    <Flex flexDir="column" gap={8} mt={{ base: 2, md: 6 }}>
      <Flex direction="column" gap={4}>
        <Flex direction="column" gap={2}>
          <Heading size="title.lg" as="h1">
            Engine
          </Heading>
          <Text>
            Engine is a backend HTTP server that calls smart contracts with your
            managed backend wallets.
          </Text>
        </Flex>

        {instanceUrl && (
          <Text>
            Engine URL: <em>{instanceUrl}</em>{" "}
            <Button
              size="sm"
              variant="link"
              onClick={setInstanceDisclosure.onOpen}
              color="blue.500"
            >
              Edit
            </Button>
          </Text>
        )}

        <NoEngineInstance
          instance={instanceUrl}
          setInstanceUrl={setInstanceUrl}
          disclosure={setInstanceDisclosure}
        />

        {!isLoggedIn ? (
          <NoConnectedWallet instance={instanceUrl} />
        ) : instanceUrl ? (
          enginePermissions.isLoading ? (
            <Center>
              <Flex py={4} direction="row" gap={4} align="center">
                <Spinner size="sm" />
                <Text>Loading Instance</Text>
              </Flex>
            </Center>
          ) : enginePermissions.isError &&
            (enginePermissions?.error as { message: string }).message ===
              "401" ? (
            <NoAuthorizedWallet instance={instanceUrl} />
          ) : enginePermissions.isError &&
            (enginePermissions?.error as { message: string }).message ===
              "Failed to fetch" ? (
            <NoServerConnection instance={instanceUrl} />
          ) : (
            <EngineNavigation instance={instanceUrl} />
          )
        ) : null}
      </Flex>
    </Flex>
  );
};

EngineManage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <EngineSidebar activePage="manage" />
    {page}
  </AppLayout>
);

EngineManage.pageId = PageId.EngineManage;

export default EngineManage;
