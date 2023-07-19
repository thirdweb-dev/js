import { HIDDEN_SERVICES, ApiKeyValidationSchema } from "./validations";

import {
  Box,
  FormControl,
  HStack,
  Input,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { ServiceName, getServiceByName } from "@thirdweb-dev/service-utils";
import {
  FieldArrayWithId,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import {
  Card,
  Checkbox,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
} from "tw-components";

interface ApiKeyKeyFormProps {
  form: UseFormReturn<ApiKeyValidationSchema, any>;
  selectedSection?: number;
  onSubmit: () => void;
  onSectionChange?: (idx: number) => void;
  tabbed?: boolean;
}
export const ApiKeyKeyForm: React.FC<ApiKeyKeyFormProps> = ({
  form,
  selectedSection,
  onSubmit,
  onSectionChange,
  tabbed = true,
}) => {
  const enabledServices =
    form.getValues("services")?.filter((srv) => !!srv.enabled) || [];

  const { fields, update } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const renderName = () => {
    return (
      <>
        <FormControl
          isRequired
          isInvalid={!!form.getFieldState("name", form.formState).error}
        >
          <FormLabel>Key name</FormLabel>
          <Input
            placeholder="Descriptive name"
            type="text"
            {...form.register("name")}
          />
          <FormErrorMessage>
            {form.getFieldState("name", form.formState).error?.message}
          </FormErrorMessage>
        </FormControl>
      </>
    );
  };

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

  const renderGeneral = () => {
    return (
      <>
        <FormControl
          isInvalid={!!form.getFieldState("domains", form.formState).error}
        >
          <FormLabel>Allowed Domains</FormLabel>
          <FormHelperText pb={2} size="body.md">
            Prevent third-parties from using your Client ID on their websites by
            only allowing requests from your domains.
          </FormHelperText>
          <Textarea
            placeholder="thirdweb.com, rpc.example.com, localhost:3000"
            {...form.register("domains")}
          />
          {!form.getFieldState("domains", form.formState).error ? (
            <FormHelperText>
              Enter domains separated by commas or new lines. Leave blank to
              deny all. Use <code>*</code> to allow any.
            </FormHelperText>
          ) : (
            <FormErrorMessage>
              {form.getFieldState("domains", form.formState).error?.message}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          isInvalid={!!form.getFieldState("bundleIds", form.formState).error}
        >
          <FormLabel>Allowed Bundle IDs</FormLabel>
          <FormHelperText pb={2} size="body.md">
            (Unity Native/React Native users only) Prevent third-parties from
            using your Client ID in their native apps by only allowing requests
            from your app bundles.
          </FormHelperText>
          <Textarea
            placeholder="com.thirdweb.app"
            {...form.register("bundleIds")}
          />
          {!form.getFieldState("bundleIds", form.formState).error ? (
            <FormHelperText>
              Enter bundle ids separated by commas or new lines. Leave blank to
              deny all. Use <code>*</code> to allow any.
            </FormHelperText>
          ) : (
            <FormErrorMessage>
              {form.getFieldState("bundleIds", form.formState).error?.message}
            </FormErrorMessage>
          )}
        </FormControl>

        {/* <FormControl>
          <FormLabel>Allowed Wallet addresses</FormLabel>
          <Textarea
            placeholder="0xa1234567890AbcC1234567Bb1bDa6c885b2886b6"
            {...form.register("walletAddresses")}
          />
          <FormHelperText>
            New line or comma-separated list of wallet addresses.
            <br />
            To allow any wallet, set to <code>*</code>.
          </FormHelperText>
        </FormControl> */}
      </>
    );
  };

  const renderServices = () => {
    return (
      <>
        <Text size="body.md">
          Choose thirdweb services this API Key is allowed to access.
        </Text>

        <VStack alignItems="flex-start" w="full" gap={4}>
          {fields.map((srv, idx) => {
            const service = getServiceByName(srv.name as ServiceName);

            return service ? (
              <Card
                w="full"
                key={srv.name}
                display={HIDDEN_SERVICES.includes(srv.name) ? "none" : "block"}
              >
                <HStack
                  justifyContent="space-between"
                  alignItems="flex-start"
                  pb={3}
                >
                  <Box>
                    <Heading size="label.lg" pb={1}>
                      {service.title}
                    </Heading>
                    <Text size="body.md">{service.description}</Text>
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

                {service.name === "bundler" && (
                  <FormControl
                    isInvalid={
                      !!form.getFieldState(`services.${idx}`, form.formState)
                        .error
                    }
                  >
                    <FormLabel>Allowed Target addresses</FormLabel>
                    <Textarea
                      disabled={!srv.enabled}
                      placeholder="0xa1234567890AbcC1234567Bb1bDa6c885b2886b6"
                      {...form.register(`services.${idx}.targetAddresses`)}
                    />
                    {!form.getFieldState(
                      `services.${idx}.targetAddresses`,
                      form.formState,
                    ).error ? (
                      <FormHelperText>
                        Enter contract/wallet addresses separated by commas or
                        new lines. Leave blank to deny all. Use <code>*</code>{" "}
                        to allow any.
                      </FormHelperText>
                    ) : (
                      <FormErrorMessage>
                        {
                          form.getFieldState(
                            `services.${idx}.targetAddresses`,
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    )}
                  </FormControl>
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
                          <HStack gap={1} cursor="help">
                            <Checkbox
                              isChecked={srv.actions.includes(sa.name)}
                              onChange={(e) =>
                                handleAction(
                                  idx,
                                  srv,
                                  sa.name,
                                  e.target.checked,
                                )
                              }
                            />
                            <Text>{sa.title}</Text>
                          </HStack>
                        </Tooltip>
                      ))}
                    </HStack>
                  </FormControl>
                )}
              </Card>
            ) : null;
          })}
        </VStack>
      </>
    );
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off">
      {tabbed && (
        <Tabs defaultIndex={selectedSection} onChange={onSectionChange}>
          <TabList>
            <Tab>General</Tab>
            <Tab>Services ({enabledServices?.length || 0})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack gap={6} pt={4}>
                {renderName()}
                {renderGeneral()}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack alignItems="flex-start" w="full" gap={3} pt={3}>
                {renderServices()}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}

      {!tabbed && (
        <VStack alignItems="flex-start" w="full" gap={6} pt={3}>
          {renderName()}
          {renderGeneral()}
        </VStack>
      )}
    </form>
  );
};
