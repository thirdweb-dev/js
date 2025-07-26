"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getContract, isAddress, type ThirdwebClient } from "thirdweb";
import { z } from "zod";
import { MultiSelect } from "@/components/blocks/multi-select";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import {
  type AddContractSubscriptionInput,
  useEngineAddContractSubscription,
} from "@/hooks/useEngine";
import { useResolveContractAbi } from "@/hooks/useResolveContractAbi";
import { parseError } from "@/utils/errorParser";

const addContractSubscriptionSchema = z.object({
  chainId: z.number().min(1, "Chain is required"),
  contractAddress: z
    .string()
    .min(1, "Contract address is required")
    .refine((val) => isAddress(val), "Invalid contract address"),
  webhookUrl: z
    .string()
    .min(1, "Webhook URL is required")
    .url("Invalid URL format"),
  processEventLogs: z.boolean(),
  filterEvents: z.array(z.string()),
  processTransactionReceipts: z.boolean(),
  filterFunctions: z.array(z.string()),
});

type AddContractSubscriptionForm = z.infer<
  typeof addContractSubscriptionSchema
>;

export function AddContractSubscriptionButton({
  instanceUrl,
  authToken,
  client,
}: {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-fit gap-2"
        >
          <PlusIcon className="size-4" />
          Add Contract Subscription
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden gap-0">
        <AddModalContent
          authToken={authToken}
          client={client}
          instanceUrl={instanceUrl}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddModalContent({
  instanceUrl,
  authToken,
  client,
  setIsOpen,
}: {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const addContractSubscription = useEngineAddContractSubscription({
    authToken,
    instanceUrl,
  });

  const [modalState, setModalState] = useState<"inputContract" | "inputData">(
    "inputContract",
  );

  const form = useForm<AddContractSubscriptionForm>({
    resolver: zodResolver(addContractSubscriptionSchema),
    defaultValues: {
      chainId: 84532,
      filterEvents: [],
      filterFunctions: [],
      processEventLogs: true,
      processTransactionReceipts: false,
    },
    mode: "onChange",
  });

  const onSubmit = (data: AddContractSubscriptionForm) => {
    const input: AddContractSubscriptionInput = {
      chain: data.chainId.toString(),
      contractAddress: data.contractAddress,
      filterEvents: data.filterEvents,
      filterFunctions: data.filterFunctions,
      processEventLogs: data.processEventLogs,
      processTransactionReceipts: data.processTransactionReceipts,
      webhookUrl: data.webhookUrl.trim(),
    };

    addContractSubscription.mutate(input, {
      onError: (error) => {
        toast.error("Failed to create Contract Subscription.", {
          description: parseError(error),
        });
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Created Contract Subscription.");
        setIsOpen(false);
      },
    });
  };

  return (
    <div>
      <DialogHeader className="p-4 lg:p-6">
        <DialogTitle>Add Contract Subscription</DialogTitle>
        {modalState === "inputContract" && (
          <DialogDescription>
            Add a contract subscription to process real-time onchain data.
          </DialogDescription>
        )}

        {modalState === "inputData" && (
          <DialogDescription>
            Select the data type to process.
            <br />
            Events logs are arbitrary data triggered by a smart contract call.
            <br />
            Transaction receipts contain details about the blockchain execution.
          </DialogDescription>
        )}
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {modalState === "inputContract" ? (
            <ModalBodyInputContract
              client={client}
              form={form}
              setModalState={setModalState}
            />
          ) : modalState === "inputData" ? (
            <ModalBodyInputData
              client={client}
              form={form}
              setModalState={setModalState}
              isAdding={addContractSubscription.isPending}
            />
          ) : null}
        </form>
      </Form>
    </div>
  );
}

const ModalBodyInputContract = ({
  form,
  setModalState,
  client,
}: {
  form: UseFormReturn<AddContractSubscriptionForm>;
  setModalState: Dispatch<SetStateAction<"inputContract" | "inputData">>;
  client: ThirdwebClient;
}) => {
  return (
    <div>
      <div className="space-y-4 px-4 lg:px-6 pb-8">
        <FormField
          control={form.control}
          name="chainId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chain</FormLabel>
              <FormControl>
                <SingleNetworkSelector
                  disableChainId
                  chainId={field.value}
                  client={client}
                  onChange={(val) => field.onChange(val)}
                  className="bg-card"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contractAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="0x..."
                  {...field}
                  className="bg-card"
                  spellCheck={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="webhookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Webhook URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://"
                  type="url"
                  {...field}
                  className="bg-card"
                />
              </FormControl>
              <FormDescription>
                Engine sends an HTTP request to your backend when new onchain
                data for this contract is detected.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end border-t bg-card p-4 lg:p-6">
        <Button
          onClick={() => setModalState("inputData")}
          disabled={!form.formState.isValid}
          className="gap-2"
        >
          Next
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const ModalBodyInputData = ({
  form,
  setModalState,
  client,
  isAdding,
}: {
  form: UseFormReturn<AddContractSubscriptionForm>;
  setModalState: Dispatch<SetStateAction<"inputContract" | "inputData">>;
  client: ThirdwebClient;
  isAdding: boolean;
}) => {
  const [processEventLogsOpen, setProcessEventLogsOpen] = useState(
    form.getValues("processEventLogs"),
  );
  const [processTransactionReceiptsOpen, setProcessTransactionReceiptsOpen] =
    useState(form.getValues("processTransactionReceipts"));
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
    <div>
      <div className="space-y-3 px-4 lg:px-6 pb-8">
        <div className="space-y-2">
          <CheckboxWithLabel>
            <Checkbox
              checked={form.watch("processEventLogs")}
              onCheckedChange={(val) => {
                const checked = !!val;
                form.setValue("processEventLogs", checked);
                setProcessEventLogsOpen(checked);
              }}
            />
            <span className="text-sm text-foreground">Event Logs</span>
          </CheckboxWithLabel>

          {/* Shows all/specific events if processing event logs */}
          {processEventLogsOpen && (
            <div className="space-y-2 pl-6">
              <RadioGroup
                defaultValue="false"
                onValueChange={(val: "false" | "true") => {
                  if (val === "true") {
                    setShouldFilterEvents(true);
                  } else {
                    setShouldFilterEvents(false);
                    form.setValue("filterEvents", []);
                  }
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="all-events" />
                    <label
                      className="text-sm text-foreground"
                      htmlFor="all-events"
                    >
                      All events
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="specific-events" />
                    <label
                      className="text-sm text-foreground"
                      htmlFor="specific-events"
                    >
                      Specific events
                    </label>
                  </div>

                  {/* List event names to select */}
                  {shouldFilterEvents && (
                    <FilterSelector
                      abiItemType="event"
                      client={client}
                      filter={filterEvents}
                      form={form}
                      setFilter={(value) =>
                        form.setValue("filterEvents", value)
                      }
                    />
                  )}
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <CheckboxWithLabel>
            <Checkbox
              checked={form.watch("processTransactionReceipts")}
              onCheckedChange={(val) => {
                const checked = !!val;
                form.setValue("processTransactionReceipts", checked);
                setProcessTransactionReceiptsOpen(checked);
              }}
            />
            <span className="text-sm text-foreground">
              Transaction Receipts
            </span>
          </CheckboxWithLabel>

          {/* Shows all/specific functions if processing transaction receipts */}
          {processTransactionReceiptsOpen && (
            <div className="space-y-2 pl-6">
              <RadioGroup
                defaultValue="false"
                onValueChange={(val: "false" | "true") => {
                  if (val === "true") {
                    setShouldFilterFunctions(true);
                  } else {
                    setShouldFilterFunctions(false);
                    form.setValue("filterFunctions", []);
                  }
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="all-functions" />
                    <label
                      htmlFor="all-functions"
                      className="text-sm text-foreground"
                    >
                      All functions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="specific-functions" />
                    <label
                      htmlFor="specific-functions"
                      className="text-sm text-foreground"
                    >
                      Specific functions
                    </label>
                  </div>

                  {/* List function names to select */}
                  {shouldFilterFunctions && (
                    <FilterSelector
                      abiItemType="function"
                      client={client}
                      filter={filterFunctions}
                      form={form}
                      setFilter={(value) =>
                        form.setValue("filterFunctions", value)
                      }
                    />
                  )}
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t bg-card p-4 lg:p-6">
        <Button
          variant="outline"
          onClick={() => setModalState("inputContract")}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isInputDataFormInvalid}
          className="gap-2"
        >
          {isAdding && <Spinner className="size-4" />}
          Add Subscription
        </Button>
      </div>
    </div>
  );
};

const FilterSelector = ({
  abiItemType,
  form,
  filter,
  setFilter,
  client,
}: {
  abiItemType: "function" | "event";
  form: UseFormReturn<AddContractSubscriptionForm>;
  filter: string[];
  setFilter: (value: string[]) => void;
  client: ThirdwebClient;
}) => {
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
        events: [],
        readFunctions: [],
        writeFunctions: [],
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
      events: [...new Set(events)].sort(),
      readFunctions: [...new Set(readFunctions)].sort(),
      writeFunctions: [...new Set(writeFunctions)].sort(),
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

  if (abiQuery.isPending) {
    return <Skeleton className="h-[52px] w-full" />;
  }

  if (filterNames.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        Cannot resolve the contract definition. Can not select {abiItemType}s.
      </p>
    );
  }

  return (
    <MultiSelect
      options={filterNames.map((name) => ({ label: name, value: name }))}
      selectedValues={filter}
      onSelectedValuesChange={setFilter}
      placeholder={`Select ${abiItemType}s`}
      className="w-full bg-card"
    />
  );
};
