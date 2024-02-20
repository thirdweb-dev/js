import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Flex,
  HStack,
  SimpleGrid,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  SERVICES,
  ServiceName,
  getServiceByName,
} from "@thirdweb-dev/service-utils";
import { useMemo } from "react";
import { Badge, Card, Heading, LinkButton, Text } from "tw-components";
import { HIDDEN_SERVICES } from "../validations";

interface ServicesDetailsProps {
  apiKey: ApiKey;
}

export const ServicesDetails: React.FC<ServicesDetailsProps> = ({ apiKey }) => {
  const { services, key } = apiKey;
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");

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
    <Card p={{ base: 4, md: 6 }} bg={bg}>
      <Flex flexDir="column" gap={6}>
        <Flex gap={1} flexDir="column">
          <Heading size="subtitle.md">Services</Heading>
          <Text>Services this API Key is allowed to access.</Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, lg: 2 }} w="100%" gap={6}>
          {sortedServices.map((srv) => {
            const service = getServiceByName(srv.name as ServiceName);
            return service ? (
              <Card
                p={{ base: 4, md: 6 }}
                key={srv.id}
                display={HIDDEN_SERVICES.includes(srv.name) ? "none" : "block"}
              >
                <Heading size="label.lg" pb={1}>
                  {service.title}
                </Heading>
                <Text pb={4} fontWeight="medium">
                  {service.description}
                </Text>

                {service.name === "bundler" && (
                  <LinkButton
                    colorScheme="primary"
                    href={`/dashboard/connect/account-abstraction?tab=1&clientId=${key}`}
                  >
                    Go to configuration
                  </LinkButton>
                )}
                {service.name === "embeddedWallets" && (
                  <LinkButton
                    colorScheme="primary"
                    href={`/dashboard/connect/embedded-wallets?tab=1&clientId=${key}`}
                  >
                    Go to configuration
                  </LinkButton>
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
                              <Text size="label.sm">{action.description}</Text>
                            </Card>
                          }
                        >
                          <Badge
                            key={action.name}
                            textTransform="capitalize"
                            px={2}
                            rounded="md"
                            cursor="help"
                            color="blue.500"
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
        </SimpleGrid>
      </Flex>
    </Card>
  );
};
