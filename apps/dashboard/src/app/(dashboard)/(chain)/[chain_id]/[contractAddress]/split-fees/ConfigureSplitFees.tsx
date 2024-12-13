"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { Alert, AlertDescription, AlertTitle } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CircleAlertIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  getContract,
  parseEventLogs,
  prepareContractCall,
  prepareEvent,
  sendAndConfirmTransaction,
} from "thirdweb";
import {
  useActiveAccount,
  useActiveWalletChain,
  useReadContract,
} from "thirdweb/react";
import { z } from "zod";

type Recipient = {
  address: string;
  percentage: string;
};

function ConfigureSplit(props: {
  children: React.ReactNode;
  isNewSplit: boolean;
  splitWallet: string;
  referenceContract: string;
  postSplitConfigure?: (splitWallet: string) => void;
}) {
  const activeAccount = useActiveAccount();
  const chain = useActiveWalletChain();
  const client = useThirdwebClient();
  const [open, setOpen] = useState(false);

  const splitFeesCore = getContract({
    address: splitFeesCoreAddress,
    client,
    chain: chain!,
  });

  const split = useReadContract({
    contract: splitFeesCore,
    method: {
      type: "function",
      name: "getSplit",
      inputs: [
        { name: "_splitWallet", type: "address", internalType: "address" },
      ],
      outputs: [
        {
          name: "",
          type: "tuple",
          internalType: "struct Split",
          components: [
            { name: "controller", type: "address", internalType: "address" },
            {
              name: "recipients",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "allocations",
              type: "uint256[]",
              internalType: "uint256[]",
            },
            {
              name: "totalAllocation",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
      ],
      stateMutability: "view",
    },
    params: [props.splitWallet],
    queryOptions: {
      enabled: !!props.splitWallet && !!chain && !props.isNewSplit,
    },
  });

  const recipients = split.data?.recipients.map((recipient, i) => ({
    address: recipient,
    percentage: (Number(split.data?.allocations[i]) / 100).toString(),
  }));

  const createSplit = async ({
    recipients,
    allocations,
    controller,
  }: {
    recipients: string[];
    allocations: bigint[];
    controller: string;
  }) => {
    if (!activeAccount || !chain) {
      throw new Error("No account or chain selected");
    }

    const splitFeesCore = getContract({
      address: splitFeesCoreAddress,
      client,
      chain,
    });

    const transaction = prepareContractCall({
      contract: splitFeesCore,
      method:
        "function createSplit(address[] memory _recipients, uint256[] memory _allocations, address _controller, address _referenceContract)",
      params: [recipients, allocations, controller, props.referenceContract],
    });

    const receipt = await sendAndConfirmTransaction({
      transaction,
      account: activeAccount,
    });

    const decodedEvent = parseEventLogs({
      events: [
        prepareEvent({
          signature:
            "event SplitCreated(address indexed splitWallet, address[] recipients, uint256[] allocations, address controller, address referenceContract)",
        }),
      ],
      logs: receipt.logs,
    });
    if (decodedEvent.length === 0 || !decodedEvent[0]) {
      throw new Error(
        `No ProxyDeployed event found in transaction: ${receipt.transactionHash}`,
      );
    }

    if (props.postSplitConfigure) {
      props.postSplitConfigure(
        (decodedEvent[0]?.args as { splitWallet: string }).splitWallet,
      );
    }

    split.refetch();
    setOpen(false);
  };

  const updateSplit = async ({
    recipients,
    allocations,
    controller,
  }: {
    recipients: string[];
    allocations: bigint[];
    controller: string;
  }) => {
    if (!activeAccount || !chain) {
      throw new Error("No account or chain selected");
    }

    console.log("gets in update split");

    const splitFeesCore = getContract({
      address: splitFeesCoreAddress,
      client,
      chain,
    });
    console.log("split fees core: ", splitFeesCore);

    const transaction = prepareContractCall({
      contract: splitFeesCore,
      method:
        "function updateSplit(address _splitWallet, address[] memory _recipients, uint256[] memory _allocations, address _controller)",
      params: [props.splitWallet, recipients, allocations, controller],
    });
    console.log("transaction: ", transaction);

    await sendAndConfirmTransaction({
      transaction,
      account: activeAccount,
    });
    console.log("transaction sent");

    split.refetch();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="z-[10001]" dialogOverlayClassName="z-[10000]">
        {chain && activeAccount ? (
          <ConfigureSplitUI
            isNewSplit={props.isNewSplit}
            activeAddress={activeAccount?.address}
            createSplit={createSplit}
            updateSplit={updateSplit}
            recipients={recipients}
            chainId={chain.id}
          >
            {props.children}
          </ConfigureSplitUI>
        ) : (
          <Alert variant="warning">
            <CircleAlertIcon className="size-5 max-sm:hidden" />
            <AlertTitle>No Claim Condition Set</AlertTitle>
            <AlertDescription>
              You have not set a claim condition for this token. You can set a
              claim condition by clicking the "Set Claim Condition" button.
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}

// TODO: place this somwhere appropriate
const splitFeesCoreAddress = "0x7d6Ba9e63eFb30c42b25db50dBD3C2F0a4578Ba2";

const formSchema = z
  .object({
    recipients: z
      .array(
        z.object({
          address: z.string().length(42, { message: "Invalid address" }),
          percentage: z.string().refine((v) => /^\d+(\.\d{1,2})?$/.test(v), {
            message: "Invalid percentage",
          }),
        }),
      )
      .min(2, { message: "Must have at least 2 recipients" }),
    controller: z.string(),
    totalAllocation: z.number(),
  })
  .superRefine((input, ctx) => {
    const { recipients } = input;

    if (recipients.reduce((sum, r) => sum + Number(r.percentage), 0) !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["totalAllocation"],
        message: "Total allocation must equal to 100%",
      });
    }
  });

function ConfigureSplitUI(props: {
  children: React.ReactNode;
  isNewSplit?: boolean;
  activeAddress?: string;
  createSplit: (values: {
    recipients: string[];
    allocations: bigint[];
    controller: string;
  }) => Promise<void>;
  updateSplit: (values: {
    recipients: string[];
    allocations: bigint[];
    controller: string;
  }) => Promise<void>;
  recipients: Recipient[] | undefined;
  chainId: number;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      controller: props.activeAddress || "",
      recipients: props.recipients || [
        {
          address: props.activeAddress || "",
          percentage: "100",
        },
        {
          address: "",
          percentage: "",
        },
      ],
      // dummy field to trigger validation
      totalAllocation: 0,
    },
  });
  const formFields = useFieldArray({
    control: form.control,
    name: "recipients",
  });

  const createNotifications = useTxNotifications(
    "Successfully created split",
    "Failed to create split",
  );

  const updateNotifications = useTxNotifications(
    "Successfully updated split",
    "Failed to update split",
  );

  const createSplitMutation = useMutation({
    mutationFn: props.createSplit,
    onSuccess: createNotifications.onSuccess,
    onError: createNotifications.onError,
  });

  const updateSplitMutation = useMutation({
    mutationFn: props.updateSplit,
    onSuccess: updateNotifications.onSuccess,
    onError: updateNotifications.onError,
  });

  const onSubmit = async () => {
    const values = form.getValues();
    const { success } = formSchema.safeParse(values);
    if (!success) return;

    const allocations = values.recipients.map(
      (r) => BigInt(r.percentage) * 100n,
    );
    console.log("allocations in submit: ", allocations);
    const recipients = values.recipients.map((r) => r.address);
    console.log("recipients in submit: ", recipients);
    console.log("is new split: ", props.isNewSplit);
    (props.isNewSplit ? createSplitMutation : updateSplitMutation).mutateAsync({
      recipients,
      allocations,
      controller: values.controller,
    });
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Create Split</DialogTitle>
          <DialogDescription>
            The receipients assigned below will be rewarded the fees received
            based on their allocations.
          </DialogDescription>
        </DialogHeader>

        {formFields.fields.map((fieldItem, index) => (
          <div className="flex items-start gap-3" key={fieldItem.id}>
            <div className="flex gap-x-2">
              <FormField
                control={form.control}
                name={`recipients.${index}.address`}
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`recipients.${index}.percentage`}
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Percentage"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <ToolTipLabel label="Remove address">
              <Button
                variant="outline"
                className="!text-destructive-text bg-background"
                onClick={() => {
                  formFields.remove(index);
                }}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </ToolTipLabel>
          </div>
        ))}

        {form.formState.errors.totalAllocation && (
          <p className="font-medium text-destructive-text text-sm">
            {form.formState.errors.totalAllocation.message}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              formFields.append({
                address: "",
                percentage: "",
              });
            }}
            className="gap-2"
          >
            <PlusIcon className="size-3" />
            Add Recipient
          </Button>
        </div>

        <Accordion type="single" collapsible className="-mx-1">
          <AccordionItem value="metadata" className="border-none">
            <AccordionTrigger className="border-border border-t px-1">
              Advanced
            </AccordionTrigger>
            <AccordionContent className="px-1">
              <FormField
                control={form.control}
                name="controller"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Controller</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DialogFooter>
          <TransactionButton
            size="sm"
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="min-w-24 gap-2"
            disabled={
              props.isNewSplit
                ? createSplitMutation.isPending
                : updateSplitMutation.isPending
            }
            isPending={
              props.isNewSplit
                ? createSplitMutation.isPending
                : updateSplitMutation.isPending
            }
            transactionCount={1}
            txChainID={props.chainId}
          >
            {props.isNewSplit ? "Create Split" : "Update Split"}
          </TransactionButton>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default ConfigureSplit;
