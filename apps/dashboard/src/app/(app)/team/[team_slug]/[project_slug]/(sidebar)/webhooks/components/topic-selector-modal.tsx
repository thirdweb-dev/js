"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { keccak256, toFunctionSelector } from "thirdweb/utils";
import type { Topic } from "@/api/webhook-configs";
import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { SignatureSelector } from "@/components/blocks/SignatureSelector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  RequiredFormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useAbiMultiFetch } from "../hooks/useAbiProcessing";
import {
  extractEventSignatures,
  extractFunctionSignatures,
  truncateMiddle,
} from "../utils/abiUtils";
import type { WebhookFormValues } from "../utils/webhookTypes";
import { webhookFormSchema } from "../utils/webhookTypes";

const TOPIC_IDS_THAT_SUPPORT_FILTERS = [
  "contracts.event.confirmed",
  "contracts.transaction.confirmed",
];

interface TopicSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topics: Topic[];
  selectedTopics: { id: string; filters: object | null }[];
  onSelectionChange: (topics: { id: string; filters: object | null }[]) => void;
  client?: ThirdwebClient;
  supportedChainIds?: Array<number>;
}

export function TopicSelectorModal(props: TopicSelectorModalProps) {
  const [tempSelection, setTempSelection] = useState<
    { id: string; filters: object | null }[]
  >(props.selectedTopics);

  // Initialize topicFilters with existing filters
  const [topicFilters, setTopicFilters] = useState<Record<string, string>>(
    () => {
      const initialFilters: Record<string, string> = {};
      props.selectedTopics.forEach((topic) => {
        if (topic.filters) {
          initialFilters[topic.id] = JSON.stringify(topic.filters, null, 2);
        }
      });
      return initialFilters;
    },
  );

  // Separate forms for event and transaction filters
  const eventFilterForm = useForm<WebhookFormValues>({
    defaultValues: {
      abi: "",
      addresses: "",
      chainIds: [] as string[],
      eventTypes: [] as string[],
      filterType: "event" as const,
      fromAddresses: "",
      // biome-ignore lint/suspicious/noExplicitAny: TODO - fix
      inputAbi: [] as any[],
      name: "",
      secret: "",
      sigHash: "",
      sigHashAbi: "",
      toAddresses: "",
      webhookUrl: "",
    },
    resolver: zodResolver(webhookFormSchema),
  });

  const transactionFilterForm = useForm<WebhookFormValues>({
    defaultValues: {
      abi: "",
      addresses: "",
      chainIds: [] as string[],
      eventTypes: [] as string[],
      filterType: "transaction" as const,
      fromAddresses: "",
      // biome-ignore lint/suspicious/noExplicitAny: TODO - fix
      inputAbi: [] as any[],
      name: "",
      secret: "",
      sigHash: "",
      sigHashAbi: "",
      toAddresses: "",
      webhookUrl: "",
    },
    resolver: zodResolver(webhookFormSchema),
  });

  const eventChainIds = useWatch({
    control: eventFilterForm.control,
    name: "chainIds",
  });
  const eventAddresses = useWatch({
    control: eventFilterForm.control,
    name: "addresses",
  });
  const transactionChainIds = useWatch({
    control: transactionFilterForm.control,
    name: "chainIds",
  });
  const transactionToAddresses = useWatch({
    control: transactionFilterForm.control,
    name: "toAddresses",
  });

  // ABI processing hooks
  const eventAbi = useAbiMultiFetch({
    addresses: eventAddresses || "",
    chainIds: eventChainIds,
    extractSignatures: extractEventSignatures,
    isOpen: props.open,
    thirdwebClient: props.client,
    type: "event",
  });

  const txAbi = useAbiMultiFetch({
    addresses: transactionToAddresses || "",
    chainIds: transactionChainIds,
    extractSignatures: extractFunctionSignatures,
    isOpen: props.open,
    thirdwebClient: props.client,
    type: "transaction",
  });

  const groupedTopics = useMemo(() => {
    const groups: Record<string, Topic[]> = {};

    props.topics.forEach((topic) => {
      const service = topic.id.split(".")[0] || "other";
      if (!groups[service]) {
        groups[service] = [];
      }
      groups[service].push(topic);
    });

    // Sort groups by service name and topics within each group
    const sortedGroups: Record<string, Topic[]> = {};
    Object.keys(groups)
      .sort()
      .forEach((service) => {
        sortedGroups[service] =
          groups[service]?.sort((a, b) => a.id.localeCompare(b.id)) || [];
      });

    return sortedGroups;
  }, [props.topics]);

  function handleTopicToggle(topicId: string, checked: boolean) {
    if (checked) {
      // Preserve existing filters if re-selecting a topic
      const existingTopic = props.selectedTopics.find((t) => t.id === topicId);
      setTempSelection((prev) => [
        ...prev,
        { id: topicId, filters: existingTopic?.filters || null },
      ]);

      // Set filter type based on topic (no longer needed since we have separate forms)
    } else {
      setTempSelection((prev) => prev.filter((topic) => topic.id !== topicId));
    }
  }

  function handleSave() {
    const processedSelection = tempSelection.map((topic) => {
      // Handle contract webhook topics with special filter processing
      if (TOPIC_IDS_THAT_SUPPORT_FILTERS.includes(topic.id)) {
        let formData: WebhookFormValues;

        // Get form data based on topic type
        if (topic.id === "contracts.event.confirmed") {
          formData = eventFilterForm.getValues();

          // Validate required fields for events
          if (!formData.chainIds || formData.chainIds.length === 0) {
            toast.error("Please select at least one chain for event filters");
            return topic;
          }
          if (!formData.addresses || formData.addresses.trim() === "") {
            toast.error("Please enter contract addresses for event filters");
            return topic;
          }

          // Build event filters
          // biome-ignore lint/suspicious/noExplicitAny: TODO - fix
          const filters: any = {
            chain_ids: formData.chainIds?.map(String),
            addresses: formData.addresses
              ? formData.addresses
                  .split(/[,\s]+/)
                  .map((addr) => addr.trim())
                  .filter(Boolean)
              : [],
          };

          if (formData.sigHash) {
            filters.signatures = [
              {
                sig_hash: formData.sigHash.startsWith("0x")
                  ? formData.sigHash
                  : keccak256(new TextEncoder().encode(formData.sigHash)),
                abi: formData.sigHashAbi || formData.abi,
                params: {},
              },
            ];
          }

          return { ...topic, filters };
        } else if (topic.id === "contracts.transaction.confirmed") {
          formData = transactionFilterForm.getValues();

          // Validate required fields for transactions
          if (!formData.chainIds || formData.chainIds.length === 0) {
            toast.error(
              "Please select at least one chain for transaction filters",
            );
            return topic;
          }
          if (!formData.fromAddresses || formData.fromAddresses.trim() === "") {
            toast.error("Please enter from addresses for transaction filters");
            return topic;
          }

          // Build transaction filters
          // biome-ignore lint/suspicious/noExplicitAny: TODO - fix
          const filters: any = {
            chain_ids: formData.chainIds?.map(String),
            from_addresses: formData.fromAddresses
              ? formData.fromAddresses
                  .split(/[,\s]+/)
                  .map((addr) => addr.trim())
                  .filter(Boolean)
              : [],
          };

          if (formData.toAddresses?.trim()) {
            filters.to_addresses = formData.toAddresses
              .split(/[,\s]+/)
              .map((addr) => addr.trim())
              .filter(Boolean);
          }

          if (formData.sigHash) {
            filters.signatures = [
              {
                sig_hash: formData.sigHash.startsWith("0x")
                  ? formData.sigHash
                  : toFunctionSelector(formData.sigHash),
                abi: formData.sigHashAbi || formData.abi,
                params: {},
              },
            ];
          }

          return { ...topic, filters };
        }
      }

      // Handle other topics with simple JSON filters
      const filters = topicFilters[topic.id];
      if (filters) {
        try {
          return { ...topic, filters: JSON.parse(filters) };
        } catch (_error) {
          toast.error(`Invalid JSON in filters for ${topic.id}`);
          return topic;
        }
      }
      return topic;
    });

    props.onSelectionChange(processedSelection);
    props.onOpenChange(false);
  }

  function handleCancel() {
    setTempSelection(props.selectedTopics);
    // Reset filter texts to original values
    const originalFilters: Record<string, string> = {};
    props.selectedTopics.forEach((topic) => {
      if (topic.filters) {
        originalFilters[topic.id] = JSON.stringify(topic.filters, null, 2);
      }
    });
    setTopicFilters(originalFilters);
    props.onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={handleCancel} open={props.open}>
      <DialogContent className="max-h-[80vh] max-w-4xl p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle className="font-semibold text-xl tracking-tight">
            Select Topics
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <div className="pb-4">
            <Accordion type="multiple" className="w-full">
              {Object.entries(groupedTopics).map(([service, topics]) => {
                const selectedCount = topics.filter((topic) =>
                  tempSelection.some((selected) => selected.id === topic.id),
                ).length;
                const totalCount = topics.length;

                return (
                  <AccordionItem key={service} value={service}>
                    <AccordionTrigger className="py-3 text-sm no-underline hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="capitalize font-medium">
                          {service}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {selectedCount}/{totalCount} selected
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 pb-4">
                      <div className="space-y-3">
                        {topics.map((topic) => (
                          <div
                            className="flex items-start space-x-3"
                            key={topic.id}
                          >
                            <Checkbox
                              checked={tempSelection.some(
                                (t) => t.id === topic.id,
                              )}
                              id={topic.id}
                              onCheckedChange={(checked) =>
                                handleTopicToggle(topic.id, !!checked)
                              }
                            />
                            <div className="grid gap-1.5 leading-none flex-1">
                              <label
                                className="text-sm font-mono font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                htmlFor={topic.id}
                              >
                                {/* Show the service name more muted */}
                                <span className="text-muted-foreground font-normal">
                                  {topic.id.split(".")[0]}.
                                </span>
                                {topic.id.slice(topic.id.indexOf(".") + 1)}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {topic.description}
                              </p>

                              {/* Show contract webhook filter form when selecting contract webhook topics */}
                              {TOPIC_IDS_THAT_SUPPORT_FILTERS.includes(
                                topic.id,
                              ) &&
                                tempSelection.some((t) => t.id === topic.id) &&
                                props.client &&
                                props.supportedChainIds && (
                                  <div className="py-3">
                                    {topic.id ===
                                    "contracts.event.confirmed" ? (
                                      <Form {...eventFilterForm}>
                                        <div className="space-y-4">
                                          {/* Chain IDs Field */}
                                          <FormField
                                            control={eventFilterForm.control}
                                            name="chainIds"
                                            render={({ field }) => (
                                              <FormItem className="flex flex-col">
                                                <div className="flex items-center justify-between text-xs">
                                                  <RequiredFormLabel>
                                                    Chain IDs
                                                  </RequiredFormLabel>
                                                </div>
                                                <FormControl>
                                                  {props.client && (
                                                    <MultiNetworkSelector
                                                      chainIds={
                                                        props.supportedChainIds
                                                      }
                                                      client={props.client}
                                                      onChange={(chainIds) =>
                                                        field.onChange(
                                                          chainIds.map(String),
                                                        )
                                                      }
                                                      selectedChainIds={
                                                        Array.isArray(
                                                          field.value,
                                                        )
                                                          ? field.value.map(
                                                              Number,
                                                            )
                                                          : []
                                                      }
                                                    />
                                                  )}
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />

                                          {/* Contract Addresses for Events */}
                                          <FormField
                                            control={eventFilterForm.control}
                                            name="addresses"
                                            render={({ field }) => (
                                              <FormItem className="flex flex-col">
                                                <div className="flex items-center justify-between text-xs">
                                                  <RequiredFormLabel>
                                                    Contract Addresses
                                                  </RequiredFormLabel>
                                                </div>
                                                <FormControl>
                                                  <div className="space-y-2">
                                                    <Input
                                                      placeholder="0x..."
                                                      {...field}
                                                    />

                                                    {/* ABI fetch status */}
                                                    <div className="mt-2 flex items-center justify-between">
                                                      {topic.id ===
                                                        "contracts.event.confirmed" &&
                                                        eventAbi.isFetching && (
                                                          <div className="flex items-center">
                                                            <Spinner className="mr-2 h-3 w-3" />
                                                            <span className="text-xs">
                                                              Fetching ABIs...
                                                            </span>
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />

                                          {/* Signature Hash Field */}
                                          <FormField
                                            control={eventFilterForm.control}
                                            name="sigHash"
                                            render={({ field }) => (
                                              <FormItem className="flex flex-col">
                                                <div className="flex items-center justify-between text-xs">
                                                  <FormLabel>
                                                    {topic.id ===
                                                    "contracts.event.confirmed"
                                                      ? "Event Signature"
                                                      : "Function Signature"}
                                                  </FormLabel>
                                                </div>
                                                <FormControl>
                                                  {topic.id ===
                                                    "contracts.event.confirmed" &&
                                                  Object.keys(
                                                    eventAbi.fetchedAbis,
                                                  ).length > 0 &&
                                                  eventAbi.signatures.length >
                                                    0 ? (
                                                    <SignatureSelector
                                                      className="block w-full max-w-90 overflow-hidden text-ellipsis"
                                                      onChange={(val) => {
                                                        field.onChange(val);
                                                        // If custom signature, clear ABI field
                                                        const known =
                                                          eventAbi.signatures.map(
                                                            (sig) =>
                                                              sig.signature,
                                                          );
                                                        if (
                                                          val &&
                                                          !known.includes(val)
                                                        ) {
                                                          eventFilterForm.setValue(
                                                            "abi",
                                                            "",
                                                          );
                                                        }
                                                      }}
                                                      options={eventAbi.signatures.map(
                                                        (sig) => ({
                                                          abi: sig.abi,
                                                          label: truncateMiddle(
                                                            sig.name,
                                                            30,
                                                            15,
                                                          ),
                                                          value: sig.signature,
                                                        }),
                                                      )}
                                                      placeholder="Select or enter an event signature"
                                                      setAbi={(abi) =>
                                                        eventFilterForm.setValue(
                                                          "sigHashAbi",
                                                          abi,
                                                        )
                                                      }
                                                      value={field.value || ""}
                                                    />
                                                  ) : topic.id ===
                                                      "contracts.transaction.confirmed" &&
                                                    Object.keys(
                                                      txAbi.fetchedAbis,
                                                    ).length > 0 &&
                                                    txAbi.signatures.length >
                                                      0 ? (
                                                    <SignatureSelector
                                                      onChange={(val) => {
                                                        field.onChange(val);
                                                        // If custom signature, clear ABI field
                                                        const known =
                                                          txAbi.signatures.map(
                                                            (sig) =>
                                                              sig.signature,
                                                          );
                                                        if (
                                                          val &&
                                                          !known.includes(val)
                                                        ) {
                                                          transactionFilterForm.setValue(
                                                            "abi",
                                                            "",
                                                          );
                                                        }
                                                      }}
                                                      options={txAbi.signatures.map(
                                                        (sig) => ({
                                                          abi: sig.abi,
                                                          label: truncateMiddle(
                                                            sig.name,
                                                            30,
                                                            15,
                                                          ),
                                                          value: sig.signature,
                                                        }),
                                                      )}
                                                      placeholder="Select or enter a function signature"
                                                      setAbi={(abi) =>
                                                        transactionFilterForm.setValue(
                                                          "sigHashAbi",
                                                          abi,
                                                        )
                                                      }
                                                      value={field.value || ""}
                                                    />
                                                  ) : (
                                                    <Input
                                                      disabled={
                                                        (topic.id ===
                                                          "contracts.event.confirmed" &&
                                                          eventAbi.isFetching) ||
                                                        (topic.id ===
                                                          "contracts.transaction.confirmed" &&
                                                          txAbi.isFetching)
                                                      }
                                                      onChange={field.onChange}
                                                      placeholder="Provide above details first..."
                                                      value={field.value}
                                                    />
                                                  )}
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                      </Form>
                                    ) : (
                                      <Form {...transactionFilterForm}>
                                        <div className="space-y-4">
                                          {/* Chain IDs Field */}
                                          <FormField
                                            control={
                                              transactionFilterForm.control
                                            }
                                            name="chainIds"
                                            render={({ field }) => (
                                              <FormItem className="flex flex-col">
                                                <div className="flex items-center justify-between text-xs">
                                                  <RequiredFormLabel>
                                                    Chain IDs
                                                  </RequiredFormLabel>
                                                </div>
                                                <FormControl>
                                                  {props.client ? (
                                                    <MultiNetworkSelector
                                                      chainIds={
                                                        props.supportedChainIds ||
                                                        []
                                                      }
                                                      client={props.client}
                                                      onChange={(chainIds) =>
                                                        field.onChange(
                                                          chainIds.map(String),
                                                        )
                                                      }
                                                      selectedChainIds={
                                                        Array.isArray(
                                                          field.value,
                                                        )
                                                          ? field.value.map(
                                                              Number,
                                                            )
                                                          : []
                                                      }
                                                    />
                                                  ) : (
                                                    <div className="text-sm text-muted-foreground">
                                                      Client not available
                                                    </div>
                                                  )}
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />

                                          {/* From/To Addresses for Transactions */}
                                          <FormField
                                            control={
                                              transactionFilterForm.control
                                            }
                                            name="fromAddresses"
                                            render={({ field }) => (
                                              <FormItem className="flex flex-col">
                                                <div className="flex items-center justify-between text-xs">
                                                  <RequiredFormLabel>
                                                    From Address
                                                  </RequiredFormLabel>
                                                </div>
                                                <FormControl>
                                                  <Input
                                                    onChange={field.onChange}
                                                    placeholder="0x..."
                                                    value={field.value ?? ""}
                                                  />
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />

                                          <FormField
                                            control={
                                              transactionFilterForm.control
                                            }
                                            name="toAddresses"
                                            render={({ field }) => (
                                              <FormItem className="flex flex-col">
                                                <div className="flex items-center justify-between text-xs">
                                                  <FormLabel>
                                                    To Address
                                                  </FormLabel>
                                                </div>
                                                <FormControl>
                                                  <div className="space-y-2">
                                                    <Input
                                                      onChange={field.onChange}
                                                      placeholder="0x..."
                                                      value={field.value || ""}
                                                    />

                                                    {/* ABI fetch status */}
                                                    <div className="mt-2 flex items-center justify-between">
                                                      {txAbi.isFetching && (
                                                        <div className="flex items-center">
                                                          <Spinner className="mr-2 h-3 w-3" />
                                                          <span className="text-xs">
                                                            Fetching ABIs...
                                                          </span>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />

                                          {/* Signature Hash Field */}
                                          <FormField
                                            control={
                                              transactionFilterForm.control
                                            }
                                            name="sigHash"
                                            render={({ field }) => (
                                              <FormItem className="flex flex-col">
                                                <div className="flex items-center justify-between text-xs">
                                                  <FormLabel>
                                                    Function Signature
                                                  </FormLabel>
                                                </div>
                                                <FormControl>
                                                  {Object.keys(
                                                    txAbi.fetchedAbis,
                                                  ).length > 0 &&
                                                  txAbi.signatures.length >
                                                    0 ? (
                                                    <SignatureSelector
                                                      onChange={(val) => {
                                                        field.onChange(val);
                                                        // If custom signature, clear ABI field
                                                        const known =
                                                          txAbi.signatures.map(
                                                            (sig) =>
                                                              sig.signature,
                                                          );
                                                        if (
                                                          val &&
                                                          !known.includes(val)
                                                        ) {
                                                          transactionFilterForm.setValue(
                                                            "abi",
                                                            "",
                                                          );
                                                        }
                                                      }}
                                                      options={txAbi.signatures.map(
                                                        (sig) => ({
                                                          abi: sig.abi,
                                                          label: truncateMiddle(
                                                            sig.name,
                                                            30,
                                                            15,
                                                          ),
                                                          value: sig.signature,
                                                        }),
                                                      )}
                                                      placeholder="Select or enter a function signature"
                                                      setAbi={(abi) =>
                                                        transactionFilterForm.setValue(
                                                          "sigHashAbi",
                                                          abi,
                                                        )
                                                      }
                                                      value={field.value || ""}
                                                    />
                                                  ) : (
                                                    <Input
                                                      disabled={
                                                        txAbi.isFetching
                                                      }
                                                      onChange={field.onChange}
                                                      placeholder="Fetching function signatures..."
                                                      value={field.value}
                                                    />
                                                  )}
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                      </Form>
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>

        <DialogFooter className="gap-4 border-border border-t bg-card p-6 lg:gap-2 flex-shrink-0">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Select {tempSelection.length}{" "}
            {tempSelection.length === 1 ? "Topic" : "Topics"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
