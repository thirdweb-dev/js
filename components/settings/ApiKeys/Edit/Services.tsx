import {
  Box,
  Flex,
  FormControl,
  HStack,
  Switch,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { ServiceName, getServiceByName } from "@thirdweb-dev/service-utils";
import {
  FieldArrayWithId,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import { Card, Checkbox, Heading, LinkButton, Text } from "tw-components";
import { ApiKeyValidationSchema, HIDDEN_SERVICES } from "../validations";
import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";

interface EditServicesProps {
  form: UseFormReturn<ApiKeyValidationSchema, any>;
  apiKey: ApiKey;
}

export const EditServices: React.FC<EditServicesProps> = ({ form, apiKey }) => {
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");
  const { fields, update } = useFieldArray({
    control: form.control,
    name: "services",
  });
  const handleAction = (
    srvIdx: number,
    srv: FieldArrayWithId<ApiKeyValidationSchema, "services", "id">,
    actionName: string,
    checked: boolean,
  ) => {
    const actions = checked
      ? [...(srv.actions || []), actionName]
      : (srv.actions || []).filter((a) => a !== actionName);

    update(srvIdx, {
      ...srv,
      actions,
    });
  };

  return (
    <Flex flexDir="column" gap={6}>
      <Flex gap={1} flexDir="column">
        <Heading size="subtitle.md">Services</Heading>
        <Text>Choose thirdweb services this API Key is allowed to access.</Text>
      </Flex>

      <Flex flexDir="column" gap={6}>
        {fields.map((srv, idx) => {
          const service = getServiceByName(srv.name as ServiceName);

          return service ? (
            <Card
              p={{ base: 4, md: 6 }}
              bg={bg}
              key={srv.name}
              display={HIDDEN_SERVICES.includes(srv.name) ? "none" : "block"}
            >
              <HStack
                justifyContent="space-between"
                alignItems="flex-start"
                pb={4}
              >
                <Box>
                  <Heading size="label.lg" pb={1}>
                    {service.title}
                  </Heading>
                  <Text fontWeight="medium">{service.description}</Text>
                </Box>

                <Switch
                  colorScheme="primary"
                  isChecked={srv.enabled}
                  onChange={() =>
                    update(idx, {
                      ...srv,
                      enabled: !srv.enabled,
                    })
                  }
                />
              </HStack>

              {service.name === "embeddedWallets" && srv.enabled && (
                <HStack>
                  <LinkButton
                    colorScheme="primary"
                    href={`/dashboard/wallets/embedded?tab=1&clientId=${apiKey.key}`}
                  >
                    Go to configuration
                  </LinkButton>
                </HStack>
              )}

              {service.name === "bundler" && srv.enabled && (
                <HStack>
                  <LinkButton
                    colorScheme="primary"
                    href={`/dashboard/wallets/smart-wallet?tab=1&clientId=${apiKey.key}`}
                  >
                    Go to configuration
                  </LinkButton>
                </HStack>
              )}

              {service.actions.length > 0 && (
                <FormControl>
                  <HStack gap={4}>
                    {service.actions.map((sa) => (
                      <Tooltip
                        key={sa.name}
                        label={
                          <Card py={2} px={4} bgColor="backgroundHighlight">
                            <Text fontSize="small" lineHeight={6}>
                              {sa.description}
                            </Text>
                          </Card>
                        }
                        p={0}
                        bg="transparent"
                        boxShadow="none"
                      >
                        <Checkbox
                          cursor="help"
                          isChecked={srv.actions.includes(sa.name)}
                          onChange={(e) =>
                            handleAction(idx, srv, sa.name, e.target.checked)
                          }
                        >
                          <Text>{sa.title}</Text>
                        </Checkbox>
                      </Tooltip>
                    ))}
                  </HStack>
                </FormControl>
              )}
            </Card>
          ) : null;
        })}
      </Flex>
    </Flex>
  );
};
