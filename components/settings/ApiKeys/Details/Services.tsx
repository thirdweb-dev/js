import { ApiKey, ApiKeyService } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  SERVICES,
  ServiceName,
  getServiceByName,
} from "@thirdweb-dev/service-utils";
import { useMemo } from "react";
import {
  Badge,
  Card,
  CodeBlock,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
import { DetailsRow } from "../DetailsRow";
import { HIDDEN_SERVICES } from "../validations";

interface ServicesDetailsProps {
  apiKey: ApiKey;
}

export const ServicesDetails: React.FC<ServicesDetailsProps> = ({ apiKey }) => {
  const { name, redirectUrls, services, key } = apiKey;
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");

  const redirectUrlContent = useMemo(() => {
    if (redirectUrls.length === 0) {
      return "None";
    }

    if (redirectUrls.includes("*")) {
      return 'Forbidden "*" found';
    }

    return <CodeBlock code={redirectUrls.join("\n")} canCopy={false} />;
  }, [redirectUrls]);

  const applicationNameContent = ({ applicationName }: ApiKeyService) => {
    if (!applicationName) {
      return name;
    }

    return <CodeBlock code={applicationName} canCopy={true} />;
  };

  const applicationImageUrlContent = ({
    applicationImageUrl,
  }: ApiKeyService) => {
    if (!applicationImageUrl) {
      return "None";
    }

    return <CodeBlock code={applicationImageUrl} canCopy={true} />;
  };

  const renderCustomAuthContent = ({ customAuthentication }: ApiKeyService) => {
    if (
      customAuthentication &&
      customAuthentication.aud.length &&
      customAuthentication.jwksUri.length
    ) {
      return (
        <Stack w="full">
          <Text isTruncated size="body.sm">
            <Text
              display="inline-block"
              fontWeight="medium"
              w={"fit-content"}
              pr={1}
            >
              JWKS:
            </Text>
            {customAuthentication.jwksUri}
          </Text>
          <Text isTruncated size="body.sm">
            <Text display="inline-block" fontWeight="medium" w={12}>
              AUD:
            </Text>
            {customAuthentication.aud}
          </Text>
        </Stack>
      );
    } else {
      return "Not configured";
    }
  };

  const renderCustomAuthenticationEndpoint = ({
    customAuthEndpoint,
  }: ApiKeyService) => {
    if (!customAuthEndpoint || customAuthEndpoint.authEndpoint.length === 0) {
      return "Not configured";
    }
    return (
      <Stack w="full">
        <Text isTruncated size="body.sm">
          <Text
            display="inline-block"
            fontWeight="medium"
            w="fit-content"
            pr={1}
          >
            Authentication Endpoint:
          </Text>
          {customAuthEndpoint.authEndpoint}
        </Text>
        <Stack isTruncated fontSize={"body.sm"}>
          <Text display="inline-block" fontWeight="medium" w="fit-content">
            Custom Headers:
          </Text>
          {customAuthEndpoint.customHeaders.map((header) => (
            <Text key={header.key}>
              {header.key}: {header.value}
            </Text>
          ))}
        </Stack>
      </Stack>
    );
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
                    href={`/dashboard/wallets/smart-wallet?tab=1&clientId=${key}`}
                  >
                    Go to configuration
                  </LinkButton>
                )}
                {service.name === "embeddedWallets" && (
                  <LinkButton
                    colorScheme="primary"
                    href={`/dashboard/wallets/embedded?tab=1&clientId=${key}`}
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
