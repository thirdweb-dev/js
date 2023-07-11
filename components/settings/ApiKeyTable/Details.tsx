import { ApiKeyDetailsRow } from "./DetailsRow";
import { GenerateApiKeyButton } from "./GenerateButton";
import { THIRDWEB_SERVICES, findByName } from "./services";
import { ApiKey, ApiKeyService } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Box,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { Badge, Card, CodeBlock, Heading, Text } from "tw-components";
import { toDateTimeLocal } from "utils/date-utils";
import { shortenString } from "utils/usedapp-external";

interface ApiKeyDetailsProps {
  apiKey: ApiKey;
  selectedSection: number;
  onSectionChange: (idx: number) => void;
}
export const ApiKeyDetails: React.FC<ApiKeyDetailsProps> = ({
  apiKey,
  selectedSection,
  onSectionChange,
}) => {
  const {
    id,
    name,
    key,
    secretMasked,
    domains,
    createdAt,
    updatedAt,
    lastAccessedAt,
    services,
  } = apiKey;

  const servicesCount = (services || []).length;

  const domainsContent = useMemo(() => {
    if (domains.length === 0) {
      return "None";
    }
    if (domains.includes("*")) {
      return "Any";
    }
    return <CodeBlock code={domains.join("\n")} />;
  }, [domains]);

  // FIXME: Enable when wallets restrictions is in use
  // const walletsContent = useMemo(() => {
  //   if (walletAddresses.length === 0) {
  //     return "None";
  //   }
  //   if (walletAddresses.includes("*")) {
  //     return "Any";
  //   }
  //   return <CodeBlock code={walletAddresses.join("\n")} />;
  // }, [walletAddresses]);

  const renderServicesContent = (service: ApiKeyService) => {
    if (service.targetAddresses.length === 0) {
      return "None";
    }
    if (service.targetAddresses.includes("*")) {
      return "Any";
    }
    return <CodeBlock code={service.targetAddresses.join("\n")} />;
  };

  const sortedServices = useMemo(() => {
    return (
      services?.sort((a, b) => {
        const keyA = THIRDWEB_SERVICES.findIndex(
          (service) => service.name === a.name,
        );
        const keyB = THIRDWEB_SERVICES.findIndex(
          (service) => service.name === b.name,
        );
        return keyA - keyB;
      }) || []
    );
  }, [services]);

  return (
    <Tabs defaultIndex={selectedSection} onChange={onSectionChange}>
      <TabList>
        <Tab>General</Tab>
        <Tab>Services ({servicesCount})</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <VStack alignItems="flex-start" w="full" gap={4} pt={4}>
            <ApiKeyDetailsRow
              title="Publishable Key"
              tooltip="Set the Publishable Key in Authorization Bearer header to access configured thirdweb services."
              content={
                <VStack gap={2} w="full" alignItems="flex-start">
                  <CodeBlock codeValue={key} code={shortenString(key, false)} />
                  <Text>
                    An example how to use Publishable key with thirdweb SDK:
                  </Text>
                  <CodeBlock
                    language="ts"
                    code={`new ThirdwebSDK("goerli", {
  thirdwebAPIKey: "${key}"
}`}
                  />
                </VStack>
              }
            />

            <ApiKeyDetailsRow
              title="Secret"
              tooltip="Set the Secret Key in Authorization Bearer header to have full, unrestricted access to all thirdweb services."
              content={
                <Box position="relative" w="full">
                  <CodeBlock code={secretMasked} canCopy={false} />
                  <GenerateApiKeyButton id={id} name={name} />
                </Box>
              }
            />

            <ApiKeyDetailsRow
              title="Allowed Domains"
              tooltip="The list of origin domains allowed to access thirdweb services via the configured Publishable Key."
              content={domainsContent}
            />

            {/*
            FIXME: Enable when wallets restrictions is in use
            <ApiKeyDetailsRow
              title="Allowed Wallet Addresses"
              tooltip="The list of wallet addresses allowed to access thirdweb services via the configured Publishable Key."
              content={walletsContent}
            /> */}

            <ApiKeyDetailsRow
              title="Created"
              content={toDateTimeLocal(createdAt)}
            />
            <ApiKeyDetailsRow
              title="Last updated"
              content={toDateTimeLocal(updatedAt)}
            />
            <ApiKeyDetailsRow
              title="Last accessed"
              content={
                lastAccessedAt ? toDateTimeLocal(lastAccessedAt) : "Unknown"
              }
            />
          </VStack>
        </TabPanel>

        <TabPanel>
          <VStack alignItems="flex-start" w="full" gap={3} pt={3}>
            {servicesCount === 0 && (
              <Text>
                There are no services linked to this API Key. It can be used to
                access all thirdweb services.
              </Text>
            )}

            {servicesCount > 0 && (
              <Text size="body.md">
                Here are thirdweb services this API Key can access.
              </Text>
            )}

            {sortedServices.map((srv) => {
              const service = findByName(srv.name);

              return service ? (
                <Card w="full" key={srv.id}>
                  <Heading size="label.lg" pb={1}>
                    {service.title}
                  </Heading>
                  <Text pb={3} size="body.md">
                    {service.description}
                  </Text>

                  {service.name === "bundler" && (
                    <ApiKeyDetailsRow
                      title="Allowed Target Addresses"
                      tooltip={`The list of contract/wallet addressed allowed to access thirdweb ${service.title} service via the configured Publishable Key.`}
                      content={renderServicesContent(srv)}
                    />
                  )}

                  {srv.actions.length > 0 && (
                    <HStack>
                      {srv.actions.map((actionName) => {
                        const action = service.actions.find(
                          (sa) => sa.name === actionName,
                        );

                        return action ? (
                          <Tooltip
                            p={0}
                            bg="transparent"
                            boxShadow={"none"}
                            label={
                              <Card py={2} px={4} bgColor="backgroundHighlight">
                                <Text size="label.sm">
                                  {action.description}
                                </Text>
                              </Card>
                            }
                          >
                            <Badge
                              key={action.name}
                              textTransform="capitalize"
                              colorScheme="blue"
                              px={2}
                              rounded="md"
                              cursor="help"
                            >
                              {action.title}
                            </Badge>
                          </Tooltip>
                        ) : null;
                      })}
                    </HStack>
                  )}
                </Card>
              ) : null;
            })}
          </VStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
