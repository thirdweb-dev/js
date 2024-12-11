"use client";

import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import {
  type AddContractSubscriptionInput,
  useEngineAddContractSubscription,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { useResolveContractAbi } from "@3rdweb-sdk/react/hooks/useResolveContractAbi";
import {
  CheckboxGroup,
  Collapse,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spinner,
  type UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useV5DashboardChain } from "lib/v5-adapter";
import { CirclePlusIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { getContract, isAddress } from "thirdweb";
import {
  Button,
  Card,
  Checkbox,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from "tw-components";

interface AddContractSubscriptionButtonProps {
  instanceUrl: string;
  authToken: string;
}

export const AddContractSubscriptionButton: React.FC<
  AddContractSubscriptionButtonProps
> = ({ instanceUrl, authToken }) => {
  const disclosure = useDisclosure();

  return (
    <>
      <Button
        onClick={disclosure.onOpen}
        variant="ghost"
        size="sm"
        leftIcon={<CirclePlusIcon className="size-6" />}
        colorScheme="primary"
        w="fit-content"
      >
        Add Contract Subscription
      </Button>

      {disclosure.isOpen && (
        <AddModal
          instanceUrl={instanceUrl}
          disclosure={disclosure}
          authToken={authToken}
        />
      )}
    </>
  );
};

interface AddContractSubscriptionForm {
  chainId: number;
  contractAddress: string;
  webhookUrl: string;
  processEventLogs: boolean;
  filterEvents: string[];
  processTransactionReceipts: boolean;
  filterFunctions: string[];
}

const AddModal = ({
  instanceUrl,
  disclosure,
  authToken,
}: {
  instanceUrl: string;
  disclosure: UseDisclosureReturn;
  authToken: string;
}) => {
  const { mutate: addContractSubscription } = useEngineAddContractSubscription({
    instanceUrl,
    authToken,
  });
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Created Contract Subscription.",
    "Failed to create Contract Subscription.",
  );
  const [modalState, setModalState] = useState<"inputContract" | "inputData">(
    "inputContract",
  );

  const form = useForm<AddContractSubscriptionForm>({
    defaultValues: {
      chainId: 84532,
      processEventLogs: true,
      filterEvents: [],
      processTransactionReceipts: false,
      filterFunctions: [],
    },
    mode: "onChange",
  });

  const onSubmit = (data: AddContractSubscriptionForm) => {
    const input: AddContractSubscriptionInput = {
      chain: data.chainId.toString(),
      contractAddress: data.contractAddress,
      webhookUrl: data.webhookUrl.trim(),
      processEventLogs: data.processEventLogs,
      filterEvents: data.filterEvents,
      processTransactionReceipts: data.processTransactionReceipts,
      filterFunctions: data.filterFunctions,
    };

    addContractSubscription(input, {
      onSuccess: () => {
        onSuccess();
        disclosure.onClose();
        trackEvent({
          category: "engine",
          action: "add-contract-subscription",
          label: "success",
          instance: instanceUrl,
        });
      },
      onError: (error) => {
        onError(error);
        trackEvent({
          category: "engine",
          action: "add-contract-subscription",
          label: "error",
          instance: instanceUrl,
          error,
        });
      },
    });
  };

  return (
    <Modal
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      isCentered
      size="lg"
    >
      <ModalOverlay />
      <ModalContent
        className="!bg-background rounded-lg border border-border"
        as="form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ModalHeader>Add Contract Subscription</ModalHeader>
        <ModalCloseButton />

        {modalState === "inputContract" ? (
          <ModalBodyInputContract form={form} setModalState={setModalState} />
        ) : modalState === "inputData" ? (
          <ModalBodyInputData form={form} setModalState={setModalState} />
        ) : null}
      </ModalContent>
    </Modal>
  );
};

const ModalBodyInputContract = ({
  form,
  setModalState,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  form: UseFormReturn<AddContractSubscriptionForm, any, undefined>;
  setModalState: Dispatch<SetStateAction<"inputContract" | "inputData">>;
}) => {
  return (
    <>
      <ModalBody>
        <div className="flex flex-col gap-4">
          <Text>
            Add a contract subscription to process real-time onchain data.
          </Text>

          <FormControl isRequired>
            <FormLabel>Chain</FormLabel>
            <SingleNetworkSelector
              chainId={form.watch("chainId")}
              onChange={(val) => form.setValue("chainId", val)}
            />
          </FormControl>

          <FormControl
            isRequired
            isInvalid={
              !!form.getFieldState("contractAddress", form.formState).error
            }
          >
            <FormLabel>Contract Address</FormLabel>
            <Input
              type="text"
              placeholder="0x..."
              {...form.register("contractAddress", {
                required: true,
                validate: (v) => {
                  const isValid = isAddress(v);
                  return !isValid ? "Invalid address" : true;
                },
              })}
            />
            <FormErrorMessage>
              {
                form.getFieldState("contractAddress", form.formState).error
                  ?.message
              }
            </FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={!!form.getFieldState("webhookUrl", form.formState).error}
          >
            <FormLabel>Webhook URL</FormLabel>
            <Input
              type="url"
              placeholder="https://"
              {...form.register("webhookUrl", {
                required: true,
                validate: (v) => {
                  try {
                    new URL(v);
                    return true;
                  } catch {
                    return "Invalid URL";
                  }
                },
              })}
            />
            <FormHelperText>
              Engine sends an HTTP request to your backend when new onchain data
              for this contract is detected.
            </FormHelperText>
            <FormErrorMessage>
              {form.getFieldState("webhookUrl", form.formState).error?.message}
            </FormErrorMessage>
          </FormControl>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          onClick={() => setModalState("inputData")}
          colorScheme="primary"
          isDisabled={!form.formState.isValid}
        >
          Next
        </Button>
      </ModalFooter>
    </>
  );
};

const ModalBodyInputData = ({
  form,
  setModalState,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  form: UseFormReturn<AddContractSubscriptionForm, any, undefined>;
  setModalState: Dispatch<SetStateAction<"inputContract" | "inputData">>;
}) => {
  const processEventLogsDisclosure = useDisclosure({
    defaultIsOpen: form.getValues("processEventLogs"),
  });
  const processTransactionReceiptsDisclosure = useDisclosure({
    defaultIsOpen: form.getValues("processTransactionReceipts"),
  });
  const [shouldFilterEvents, setShouldFilterEvents] = useState(false);
  const [shouldFilterFunctions, setShouldFilterFunctions] = useState(false);

  const processEventLogs = form.watch("processEventLogs");
  const filterEvents = form.watch("filterEvents");
  const processTransactionReceipts = form.watch("processTransactionReceipts");
  const filterFunctions = form.watch("filterFunctions");

  // Invalid states:
  // - Neither logs nor receipts are selected.
  // - Logs are selected but filtering on 0 event names.
  // - Receipts are selected but filtering on 0 function names.
  const isInputDataFormInvalid =
    (!processEventLogs && !processTransactionReceipts) ||
    (processEventLogs && shouldFilterEvents && filterEvents.length === 0) ||
    (processTransactionReceipts &&
      shouldFilterFunctions &&
      filterFunctions.length === 0);

  return (
    <>
      <ModalBody>
        <div className="flex flex-col gap-4">
          <Text>
            Select the data type to process.
            <br />
            Events logs are arbitrary data triggered by a smart contract call.
            <br />
            Transaction receipts contain details about the blockchain execution.
          </Text>

          <FormControl>
            <FormLabel>Processed Data</FormLabel>

            <div className="flex flex-col gap-2">
              <Checkbox
                {...form.register("processEventLogs")}
                checked={form.getValues("processEventLogs")}
                onChange={(e) => {
                  const { checked } = e.target;
                  form.setValue("processEventLogs", checked);
                  if (checked) {
                    processEventLogsDisclosure.onOpen();
                  } else {
                    processEventLogsDisclosure.onClose();
                  }
                }}
              >
                <Text>Event Logs</Text>
              </Checkbox>
              {/* Shows all/specific events if processing event logs */}
              <Collapse in={processEventLogsDisclosure.isOpen}>
                <div className="flex flex-col gap-2 px-4">
                  <RadioGroup
                    defaultValue="false"
                    onChange={(val: "false" | "true") => {
                      if (val === "true") {
                        setShouldFilterEvents(true);
                      } else {
                        setShouldFilterEvents(false);
                        form.setValue("filterEvents", []);
                      }
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <Radio value="false">
                        <Text>All events</Text>
                      </Radio>
                      <Radio value="true">
                        <Text>
                          Specific events{" "}
                          {!!filterEvents.length &&
                            `(${filterEvents.length} selected)`}
                        </Text>
                      </Radio>
                      {/* List event names to select */}
                      <Collapse in={shouldFilterEvents}>
                        <FilterSelector
                          abiItemType="event"
                          form={form}
                          filter={filterEvents}
                          setFilter={(value) =>
                            form.setValue("filterEvents", value)
                          }
                        />
                      </Collapse>
                    </div>
                  </RadioGroup>
                </div>
              </Collapse>

              <Checkbox
                {...form.register("processTransactionReceipts")}
                checked={form.getValues("processTransactionReceipts")}
                onChange={(e) => {
                  const { checked } = e.target;
                  form.setValue("processTransactionReceipts", checked);
                  if (checked) {
                    processTransactionReceiptsDisclosure.onOpen();
                  } else {
                    processTransactionReceiptsDisclosure.onClose();
                  }
                }}
              >
                <Text>Transaction Receipts</Text>
              </Checkbox>
              {/* Shows all/specific functions if processing transaction receipts */}
              <Collapse in={processTransactionReceiptsDisclosure.isOpen}>
                <div className="flex flex-col gap-2 px-4">
                  <RadioGroup
                    defaultValue="false"
                    onChange={(val: "false" | "true") => {
                      if (val === "true") {
                        setShouldFilterFunctions(true);
                      } else {
                        setShouldFilterFunctions(false);
                        form.setValue("filterFunctions", []);
                      }
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <Radio value="false">
                        <Text>All functions</Text>
                      </Radio>
                      <Radio value="true">
                        <Text>
                          Specific functions{" "}
                          {!!filterFunctions.length &&
                            `(${filterFunctions.length} selected)`}
                        </Text>
                      </Radio>
                      {/* List function names to select */}
                      <Collapse in={shouldFilterFunctions}>
                        <FilterSelector
                          abiItemType="function"
                          form={form}
                          filter={filterFunctions}
                          setFilter={(value) =>
                            form.setValue("filterFunctions", value)
                          }
                        />
                      </Collapse>
                    </div>
                  </RadioGroup>
                </div>
              </Collapse>
            </div>
          </FormControl>
        </div>
      </ModalBody>

      <ModalFooter as={Flex} gap={3}>
        <Button
          type="button"
          onClick={() => setModalState("inputContract")}
          variant="ghost"
        >
          Back
        </Button>
        <Button
          type="submit"
          colorScheme="primary"
          isDisabled={isInputDataFormInvalid}
        >
          Add
        </Button>
      </ModalFooter>
    </>
  );
};

const FilterSelector = ({
  abiItemType,
  form,
  filter,
  setFilter,
}: {
  abiItemType: "function" | "event";
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  form: UseFormReturn<AddContractSubscriptionForm, any, undefined>;
  filter: string[];
  setFilter: (value: string[]) => void;
}) => {
  const client = useThirdwebClient();
  const chain = useV5DashboardChain(form.getValues("chainId"));
  const address = form.getValues("contractAddress");
  const contract = useMemo(
    () =>
      chain
        ? getContract({
            address,
            chain,
            client,
          })
        : undefined,
    [chain, client, address],
  );

  const abiQuery = useResolveContractAbi(contract);

  const abiItems = useMemo(() => {
    if (!abiQuery.data) {
      return {
        readFunctions: [],
        writeFunctions: [],
        events: [],
      };
    }
    const readFunctions: string[] = [];
    const writeFunctions: string[] = [];
    const events: string[] = [];
    for (const abiItem of abiQuery.data) {
      if (abiItem.type === "function") {
        if (
          abiItem.stateMutability === "pure" ||
          abiItem.stateMutability === "view"
        ) {
          readFunctions.push(abiItem.name);
        } else {
          writeFunctions.push(abiItem.name);
        }
      } else if (abiItem.type === "event") {
        events.push(abiItem.name);
      }
    }
    return {
      readFunctions: [...new Set(readFunctions)].sort(),
      writeFunctions: [...new Set(writeFunctions)].sort(),
      events: [...new Set(events)].sort(),
    };
  }, [abiQuery.data]);

  const filterNames = useMemo(() => {
    switch (abiItemType) {
      case "function": {
        return abiItems.writeFunctions;
      }
      case "event": {
        return abiItems.events;
      }
      default: {
        return [];
      }
    }
  }, [abiItemType, abiItems.events, abiItems.writeFunctions]);

  return (
    <Card>
      {abiQuery.isPending ? (
        <Spinner size="sm" />
      ) : filterNames.length === 0 ? (
        <Text>
          Cannot resolve the contract definition. Filters are unavailable.
        </Text>
      ) : (
        <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
          <CheckboxGroup
            value={filter}
            onChange={(selected: string[]) => setFilter(selected)}
          >
            {filterNames.map((name) => (
              <Checkbox key={name} value={name}>
                <Text>{name}</Text>
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      )}
    </Card>
  );
};
