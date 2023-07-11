import { findByName } from "./services";
import { ApiKeyFormValues } from "./types";
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
import { UseFormReturn, useFieldArray } from "react-hook-form";
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
  form: UseFormReturn<ApiKeyFormValues, any>;
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
        <FormControl>
          <FormLabel>Key name</FormLabel>
          <Input
            placeholder="Descriptive name"
            type="text"
            {...form.register("name", { minLength: 3 })}
          />
          <FormErrorMessage>
            {form.getFieldState("name", form.formState).error?.message}
          </FormErrorMessage>
        </FormControl>
      </>
    );
  };

  const handleEnableAction = (
    srvIdx: number,
    actionName: string,
    checked: boolean,
  ) => {
    console.log({ srvIdx, actionName, checked });
  };

  const renderGeneral = () => {
    return (
      <>
        <FormControl>
          <FormLabel>Allowed Domains</FormLabel>
          <Textarea
            placeholder="thirdweb.com, rpc.example.com"
            {...form.register("domains")}
          />
          <FormHelperText>
            New line or comma-separated list of domain names.
            <br />
            To allow any domain, set to <code>*</code>.
          </FormHelperText>
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
            const service = findByName(srv.name);

            return service ? (
              <Card w="full" key={srv.name}>
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
                  <FormControl>
                    <FormLabel>Allowed Target addresses</FormLabel>
                    <Textarea
                      disabled={!srv.enabled}
                      placeholder="0xa1234567890AbcC1234567Bb1bDa6c885b2886b6"
                      {...form.register(`services.${idx}.targetAddresses`)}
                    />
                    <FormHelperText>
                      New line or comma-separated list of contract/wallet
                      addresses.
                      <br />
                      To allow any target, set to <code>*</code>.
                    </FormHelperText>
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
                              onChange={({ target: { checked } }) =>
                                update(idx, {
                                  ...srv,
                                  actions: checked
                                    ? [...(srv.actions || []), sa.name]
                                    : (srv.actions || []).filter(
                                        (a) => a !== sa.name,
                                      ),
                                })
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
              <VStack gap={4} pt={4}>
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
        <VStack alignItems="flex-start" w="full" gap={3} pt={3}>
          {renderName()}
          {renderServices()}
        </VStack>
      )}
    </form>
  );
};
