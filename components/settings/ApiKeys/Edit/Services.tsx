import {
  Box,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Input,
  Stack,
  Switch,
  Textarea,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { ServiceName, getServiceByName } from "@thirdweb-dev/service-utils";
import {
  FieldArrayWithId,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import { LuTrash2 } from "react-icons/lu";
import {
  Button,
  Card,
  Checkbox,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
import { NoTargetAddressesAlert } from "../Alerts";
import { ApiKeyValidationSchema, HIDDEN_SERVICES } from "../validations";
import { GatedFeature } from "components/settings/Account/Billing/GatedFeature";
import { GatedSwitch } from "components/settings/Account/Billing/GatedSwitch";
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
          const customBrandingEnabled =
            !!srv.applicationImageUrl?.length || !!srv.applicationName?.length;

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

// to prevent the useFieldArray from inserting an empty array into the form values until needed
// TODO: consolidate this with the component in embedded-wallet/Configure/index.tsx when we refactor the embedded wallet settings to somehow share types properly
const CustomAuthHeaders = ({
  form,
  serviceIdx,
}: {
  form: UseFormReturn<ApiKeyValidationSchema, any>;
  serviceIdx: number;
}) => {
  const customAuthEndpointHeaderField = useFieldArray({
    control: form.control,
    name: `services.${serviceIdx}.customAuthEndpoint.customHeaders`,
  });

  return (
    <FormControl
      isInvalid={
        !!form.getFieldState(
          `services.${serviceIdx}.customAuthEndpoint.customHeaders`,
          form.formState,
        ).error
      }
    >
      <FormLabel size="label.sm">Custom Headers</FormLabel>
      <Stack gap={3} alignItems={"end"}>
        {customAuthEndpointHeaderField.fields.map((_, customHeaderIdx) => {
          return (
            <Flex key={customHeaderIdx} gap={2} w="full">
              <Input
                placeholder="Key"
                type="text"
                {...form.register(
                  `services.${serviceIdx}.customAuthEndpoint.customHeaders.${customHeaderIdx}.key`,
                )}
              />
              <Input
                placeholder="Value"
                type="text"
                {...form.register(
                  `services.${serviceIdx}.customAuthEndpoint.customHeaders.${customHeaderIdx}.value`,
                )}
              />
              <IconButton
                aria-label="Remove header"
                icon={<LuTrash2 />}
                onClick={() => {
                  customAuthEndpointHeaderField.remove(customHeaderIdx);
                }}
              />
            </Flex>
          );
        })}
        <Button
          onClick={() => {
            customAuthEndpointHeaderField.append({
              key: "",
              value: "",
            });
          }}
          w={
            customAuthEndpointHeaderField.fields.length === 0
              ? "full"
              : "fit-content"
          }
        >
          Add header
        </Button>
      </Stack>

      {!form.getFieldState(
        `services.${serviceIdx}.customAuthEndpoint.customHeaders`,
        form.formState,
      ).error && (
        <FormHelperText>
          Set custom headers to be sent along the request with the payload to
          the authentication endpoint above. You can set values to verify the
          incoming request here.
        </FormHelperText>
      )}
      <FormErrorMessage>
        {
          form.getFieldState(
            `services.${serviceIdx}.customAuthEndpoint.customHeaders`,
            form.formState,
          ).error?.message
        }
      </FormErrorMessage>
    </FormControl>
  );
};
