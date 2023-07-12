import { ApiKeyDetailsRow } from "./DetailsRow";
import { GenerateApiKeyButton } from "./GenerateButton";
import { THIRDWEB_SERVICES, findByName } from "./services";
import { ApiKey, ApiKeyService } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Divider,
  Flex,
  HStack,
  Kbd,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
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
  const [generatedKey, setGeneratedKey] = useState<ApiKey>(apiKey);

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
  } = generatedKey;

  const servicesCount = (services || []).length;

  const domainsContent = useMemo(() => {
    if (domains.length === 0) {
      return (
        <Alert status="error" variant="left-accent">
          <Flex direction="column" gap={1.5}>
            <Heading size="label.md" as={AlertTitle}>
              No Domains Configured
            </Heading>
            <Text size="body.sm" as={AlertDescription}>
              This Publishable Key cannot be used until at least one domain is
              configured. To allow access from any domain, use the wildcard:{" "}
              <Kbd>*</Kbd>
            </Text>
          </Flex>
        </Alert>
      );
    }
    if (domains.includes("*")) {
      return (
        <Alert status="warning" variant="left-accent">
          <Flex direction="column" gap={1.5}>
            <Heading size="label.md" as={AlertTitle}>
              Unrestricted Access
            </Heading>
            <Text size="body.sm" as={AlertDescription}>
              This Publishable Key can be used from any domain. Anyone with the
              key can use it to access all the services enabled for this key.
            </Text>
          </Flex>
        </Alert>
      );
    }
    return <CodeBlock code={domains.join("\n")} canCopy={false} />;
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
    <Tabs defaultIndex={selectedSection} onChange={onSectionChange} h="full">
      <TabList borderColor="borderColor">
        <Tab>General</Tab>
        <Tab>Services ({servicesCount})</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <VStack align="flex-start" w="full" gap={6} py={4}>
            <ApiKeyDetailsRow
              title="Publishable Key"
              description="The Publishable Key can be restricted to allowed domains and enabled services. Use the it to access thirdweb services from the browser."
              content={
                <VStack gap={2} w="full" alignItems="flex-start">
                  <CodeBlock codeValue={key} code={shortenString(key, false)} />
                  <Text>
                    Instantiate the thirdweb SDK with your Publishable Key:
                  </Text>
                  <CodeBlock
                    language="ts"
                    whiteSpace="pre"
                    codeValue={`const sdk = new ThirdwebSDK("goerli", {
                      apiKey: "${key}"
                    });`}
                    code={`const sdk = new ThirdwebSDK("goerli", {
  apiKey: "${shortenString(key, false)}"
});`}
                  />
                </VStack>
              }
            />
            <ApiKeyDetailsRow
              title="Allowed Domains"
              tooltip={`Prevent third-parties from using your Publishable Key on their websites by only allowing requests from your domains.`}
              content={domainsContent}
            />

            <Divider />

            <ApiKeyDetailsRow
              title="Secret Key"
              description="The Secret Key does not adhere to restrictions you define. Anyone with the Secret Key can access all thirdweb services."
              content={
                <Box position="relative" w="full">
                  <CodeBlock
                    code={secretMasked || "No secret created yet"}
                    canCopy={false}
                  />
                  <GenerateApiKeyButton
                    id={id}
                    name={name}
                    generatedKey={generatedKey}
                    setGeneratedKey={setGeneratedKey}
                  />
                </Box>
              }
            />

            {/*
            FIXME: Enable when wallets restrictions is in use
            <ApiKeyDetailsRow
              title="Allowed Wallet Addresses"
              tooltip="The list of wallet addresses allowed to access thirdweb services via the configured Publishable Key."
              content={walletsContent}
            /> */}

            <Divider mt="auto" />

            <SimpleGrid columns={2} w="100%" gap={4}>
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
                  lastAccessedAt ? toDateTimeLocal(lastAccessedAt) : "Never"
                }
              />
            </SimpleGrid>
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
                            key={action.name}
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
