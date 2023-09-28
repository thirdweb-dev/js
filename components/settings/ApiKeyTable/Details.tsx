import { ApiKeyDetailsRow } from "./DetailsRow";
import { HIDDEN_SERVICES } from "./validations";
import { ApiKey, ApiKeyService } from "@3rdweb-sdk/react/hooks/useApi";
import {
  HStack,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  SERVICES,
  ServiceName,
  getServiceByName,
} from "@thirdweb-dev/service-utils";
import { useMemo } from "react";
import { Badge, Card, CodeBlock, Heading, Text } from "tw-components";
import { toDateTimeLocal } from "utils/date-utils";
import {
  NoDomainsAlert,
  AnyDomainAlert,
  NoBundleIdsAlert,
  AnyBundleIdAlert,
} from "./Alerts";

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
    key,
    secretMasked,
    domains,
    bundleIds,
    createdAt,
    updatedAt,
    lastAccessedAt,
    services,
  } = apiKey;

  const servicesCount = (services || []).length;

  const domainsContent = useMemo(() => {
    if (domains.length === 0) {
      return <NoDomainsAlert />;
    }

    if (domains.includes("*")) {
      return <AnyDomainAlert />;
    }

    return <CodeBlock code={domains.join("\n")} canCopy={false} />;
  }, [domains]);

  const bundleIdsContent = useMemo(() => {
    if (bundleIds.length === 0) {
      return <NoBundleIdsAlert />;
    }

    if (bundleIds.includes("*")) {
      return <AnyBundleIdAlert />;
    }

    return <CodeBlock code={bundleIds.join("\n")} canCopy={false} />;
  }, [bundleIds]);

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
        const keyA = SERVICES.findIndex((service) => service.name === a.name);
        const keyB = SERVICES.findIndex((service) => service.name === b.name);
        return keyA - keyB;
      }) || []
    );
  }, [services]);

  return (
    <Tabs
      defaultIndex={selectedSection}
      onChange={onSectionChange}
      h="full"
      mx={-6}
    >
      <TabList borderColor="borderColor">
        <Tab>General</Tab>
        <Tab>
          Services (
          {
            (services || []).filter((e) => !HIDDEN_SERVICES.includes(e.name))
              .length
          }
          )
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <VStack align="flex-start" w="full" gap={8} py={4}>
            <ApiKeyDetailsRow
              title="Client Id"
              description={`Identifies your application. It should generally be restricted to specific domains (web) and/or bundle-ids (native).`}
              content={<CodeBlock code={key} />}
            />

            {/* for very old api keys the secretmask might be `null`, if that's the case we skip it */}
            {secretMasked && (
              <ApiKeyDetailsRow
                title="Secret Key"
                description="Identifies and authenticates your application from the backend. Using the secret key bypasses any allowed domains or bundle ids."
                content={<CodeBlock code={secretMasked} canCopy={false} />}
              />
            )}

            <ApiKeyDetailsRow
              title="Allowed Domains"
              tooltip={`Prevent third-parties from using your Client ID by restricting access to allowed domains.`}
              content={domainsContent}
            />

            <ApiKeyDetailsRow
              title="Allowed Bundle IDs"
              tooltip={`Prevent third-parties from using your Client ID by restricting access to allowed Bundle IDs. This is applicable only if you want to use your key with native games or native mobile applications.`}
              content={bundleIdsContent}
            />

            {/*
            FIXME: Enable when wallets restrictions is in use
            <ApiKeyDetailsRow
              title="Allowed Wallet Addresses"
              tooltip="The list of wallet addresses allowed to access thirdweb services via the configured Publishable Key."
              content={walletsContent}
            /> */}

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
              <Text>There are no services enabled for this API Key.</Text>
            )}

            {sortedServices.map((srv) => {
              const service = getServiceByName(srv.name as ServiceName);

              return service ? (
                <Card
                  w="full"
                  key={srv.id}
                  display={
                    HIDDEN_SERVICES.includes(srv.name) ? "none" : "block"
                  }
                >
                  <Heading size="label.lg" pb={1}>
                    {service.title}
                  </Heading>
                  <Text pb={3} size="body.md">
                    {service.description}
                  </Text>

                  {service.name === "bundler" && (
                    <ApiKeyDetailsRow
                      title="Destination Contracts"
                      tooltip={`Restrict contracts your wallets can interact with through the thirdweb ${service.title} service.`}
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
