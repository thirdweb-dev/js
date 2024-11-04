"use client";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleAlertIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type PreparedTransaction, sendAndConfirmTransaction } from "thirdweb";
import { ClaimableERC721, ClaimableERC1155 } from "thirdweb/modules";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { z } from "zod";
import { addressSchema } from "../zod-schemas";
import { CurrencySelector } from "./CurrencySelector";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";

export type ClaimCondition = {
  availableSupply: bigint;
  allowlistMerkleRoot: `0x${string}`;
  pricePerUnit: bigint;
  currency: string;
  maxMintPerWallet: bigint;
  startTimestamp: number;
  endTimestamp: number;
  auxData: string;
};

function ClaimableModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;
  const account = useActiveAccount();

  const primarySaleRecipientQuery = useReadContract(
    ClaimableERC721.getSaleConfig,
    {
      contract: contract,
    },
  );
  const claimConditionQuery = useReadContract(
    ClaimableERC721.getClaimCondition,
    {
      contract: contract,
    },
  );

  const isErc721 = props.contractInfo.name === "ClaimableERC721";
  const isSequentialTokenIdInstalled = !!props.allModuleContractInfo.find(
    (module) => module.name.includes("SequentialTokenId"),
  );

  const mint = useCallback(
    async (values: MintFormValues) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      let mintTx: PreparedTransaction;
      if (isErc721) {
        mintTx = ClaimableERC721.mint({
          contract,
          to: values.recipient,
          quantity: values.quantity,
        });
      } else if (values.tokenId) {
        mintTx = ClaimableERC1155.mint({
          contract,
          to: values.recipient,
          quantity: values.quantity,
          tokenId: BigInt(values.tokenId),
        });
      } else {
        throw new Error("Invalid tokenId");
      }

      await sendAndConfirmTransaction({
        account: account,
        transaction: mintTx,
      });
    },
    [contract, account, isErc721],
  );

  const update = useCallback(
    async (values: ConfigFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      console.log("values: ", values);

      let setClaimConditionTx: PreparedTransaction;
      if (isErc721) {
        setClaimConditionTx = ClaimableERC721.setClaimCondition({
          ...values,
          contract,
          allowList:
            values.allowList && values.allowList.length > 0
              ? values.allowList.map(({ address }) => address)
              : undefined,
        });
      } else if (values.tokenId) {
        setClaimConditionTx = ClaimableERC1155.setClaimCondition({
          ...values,
          contract,
          allowList:
            values.allowList && values.allowList.length > 0
              ? values.allowList.map(({ address }) => address)
              : undefined,
          tokenId: BigInt(values.tokenId),
        });
      } else {
        throw new Error("Invalid tokenId");
      }

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: setClaimConditionTx,
      });

      const setSaleConfigTx = ClaimableERC721.setSaleConfig({
        contract: contract,
        primarySaleRecipient: values.primarySaleRecipient,
      });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: setSaleConfigTx,
      });
    },
    [contract, ownerAccount, isErc721],
  );

  return (
    <ClaimableModuleUI
      {...props}
      isPending={
        primarySaleRecipientQuery.isPending || claimConditionQuery.isPending
      }
      primarySaleRecipient={primarySaleRecipientQuery.data}
      claimCondition={claimConditionQuery.data}
      update={update}
      mint={mint}
      isOwnerAccount={!!ownerAccount}
      isErc721={isErc721}
      isSequentialTokenIdInstalled={isSequentialTokenIdInstalled}
      chainId={props.contract.chain.id}
    />
  );
}

export function ClaimableModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    primarySaleRecipient: string | undefined;
    isPending: boolean;
    isOwnerAccount: boolean;
    claimCondition: ClaimCondition | undefined;
    update: (values: ConfigFormValues) => Promise<void>;
    mint: (values: MintFormValues) => Promise<void>;
    isErc721: boolean;
    isSequentialTokenIdInstalled: boolean;
    chainId: number;
  },
) {
  return (
    <ModuleCardUI {...props}>
      <div className="h-1" />
      {props.isPending && <Skeleton className="h-[74px]" />}

      {!props.isPending && (
        <div className="flex flex-col gap-4">
          {/* Mint NFT */}
          <Accordion type="single" collapsible className="-mx-1">
            <AccordionItem value="metadata" className="border-none">
              <AccordionTrigger className="border-border border-t px-1">
                Mint NFT
              </AccordionTrigger>
              <AccordionContent className="px-1">
                {props.isOwnerAccount && (
                  <MintNFTSection
                    mint={props.mint}
                    isErc721={props.isErc721}
                    isSequentialTokenIdInstalled={
                      props.isSequentialTokenIdInstalled
                    }
                  />
                )}
                {!props.isOwnerAccount && (
                  <Alert variant="info">
                    <CircleAlertIcon className="size-5" />
                    <AlertTitle>
                      You don't have permission to mint NFTs on this contract
                    </AlertTitle>
                  </Alert>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="primary-sale-recipient"
              className="border-none "
            >
              <AccordionTrigger className="border-border border-t px-1 text-left">
                Claim Conditions & Primary Sale Recipient
              </AccordionTrigger>
              <AccordionContent className="px-1">
                <ConfigSection
                  isOwnerAccount={props.isOwnerAccount}
                  primarySaleRecipient={props.primarySaleRecipient}
                  claimCondition={props.claimCondition}
                  update={props.update}
                  isErc721={props.isErc721}
                  chainId={props.chainId}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </ModuleCardUI>
  );
}

const configFormSchema = z.object({
  primarySaleRecipient: addressSchema,

  tokenId: z.string().optional(),

  pricePerToken: z.number().optional(),
  currencyAddress: z.string().optional(),

  maxClaimableSupply: z
    .string()
    .refine((v) => v.length === 0 || Number(v) >= 0, {
      message: "Invalid max claimable supply",
    }),
  maxClaimablePerWallet: z
    .string()
    .refine((v) => v.length === 0 || Number(v) >= 0, {
      message: "Invalid max claimable per wallet",
    }),

  startTime: z.date().optional(),
  endTime: z.date().optional(),

  allowList: z.array(z.object({ address: addressSchema })).optional(),
});

export type ConfigFormValues = z.infer<typeof configFormSchema>;

// perform this outside else it forces too many re-renders
const now = Date.now() / 1000;

function ConfigSection(props: {
  primarySaleRecipient: string | undefined;
  claimCondition: ClaimCondition | undefined;
  update: (values: ConfigFormValues) => Promise<void>;
  isOwnerAccount: boolean;
  isErc721: boolean;
  chainId: number;
}) {
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    values: {
      primarySaleRecipient: props.primarySaleRecipient || "",
      // TODO: parse units based on the currency decimals
      pricePerToken: props.claimCondition?.pricePerUnit ? 0 : 0,
      currencyAddress:
        props.claimCondition?.currency ===
        "0x0000000000000000000000000000000000000000"
          ? ""
          : props.claimCondition?.currency,
      maxClaimableSupply:
        props.claimCondition?.availableSupply.toString() === "0"
          ? ""
          : props.claimCondition?.availableSupply.toString() || "",
      maxClaimablePerWallet:
        props.claimCondition?.maxMintPerWallet.toString() === "0"
          ? ""
          : props.claimCondition?.maxMintPerWallet.toString() || "",
      startTime: new Date((props.claimCondition?.startTimestamp || now) * 1000),
      endTime: new Date(
        (props.claimCondition?.endTimestamp || now + 604800) * 1000,
      ),
      allowList: [],
    },
  });
  const allowListFields = useFieldArray({
    control: form.control,
    name: "allowList",
  });

  const endTime = form.watch("endTime");

  const updateMutation = useMutation({
    mutationFn: props.update,
  });

  const onSubmit = async () => {
    const values = form.getValues();
    if (!props.isErc721 && !values.tokenId) {
      form.setError("tokenId", { message: "Token ID is required" });
      return;
    }
    const promise = updateMutation.mutateAsync(values);
    toast.promise(promise, {
      success:
        "Successfully updated claim conditions or primary sale recipient",
      error: (error) =>
        `Failed to update claim conditions or primary sale recipient: ${error}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {!props.isErc721 && (
              <FormField
                control={form.control}
                name="tokenId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Token ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!props.isOwnerAccount} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="primarySaleRecipient"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Sale Recipient</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0x..."
                      {...field}
                      disabled={!props.isOwnerAccount}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="pricePerToken"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Price Per Token</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!props.isOwnerAccount} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currencyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <CurrencySelector
                    contractChainId={props.chainId}
                    field={field}
                  />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="maxClaimableSupply"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Max Available Supply</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!props.isOwnerAccount} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxClaimablePerWallet"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Maximum number of mints per wallet</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!props.isOwnerAccount} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex flex-1 items-center gap-2">
                <FormLabel>Start & End Time</FormLabel>
                <FormControl>
                  <DatePickerWithRange
                    from={field.value || new Date()}
                    to={endTime || new Date()}
                    setFrom={field.onChange}
                    setTo={(to: Date) => form.setValue("endTime", to)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <div className="w-full space-y-2">
            <FormLabel>Allowlist</FormLabel>
            <div className="flex flex-col gap-3">
              {allowListFields.fields.map((fieldItem, index) => (
                <div className="flex items-start gap-3" key={fieldItem.id}>
                  <FormField
                    control={form.control}
                    name={`allowList.${index}.address`}
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl>
                          <Input
                            placeholder="0x..."
                            {...field}
                            disabled={!props.isOwnerAccount}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ToolTipLabel label="Remove address">
                    <Button
                      variant="outline"
                      className="!text-destructive-text bg-background"
                      onClick={() => {
                        allowListFields.remove(index);
                      }}
                      disabled={!props.isOwnerAccount}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </ToolTipLabel>
                </div>
              ))}

              {allowListFields.fields.length === 0 && (
                <Alert variant="warning">
                  <CircleAlertIcon className="size-5 max-sm:hidden" />
                  <AlertTitle className="max-sm:!pl-0">
                    No allowlist configured
                  </AlertTitle>
                </Alert>
              )}
            </div>

            <div className="h-1" />

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // add admin by default if adding the first input
                  allowListFields.append({
                    address: "",
                  });
                }}
                className="gap-2"
                disabled={!props.isOwnerAccount}
              >
                <PlusIcon className="size-3" />
                Add Address
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              className="min-w-24 gap-2"
              disabled={updateMutation.isPending || !props.isOwnerAccount}
              type="submit"
            >
              {updateMutation.isPending && <Spinner className="size-4" />}
              Update
            </Button>
          </div>
        </div>
      </form>{" "}
    </Form>
  );
}

const mintFormSchema = z.object({
  tokenId: z.number().optional(),
  quantity: z.string().refine((v) => v.length > 0 && Number(v) >= 0, {
    message: "Invalid quantity",
  }),
  recipient: addressSchema,
});

export type MintFormValues = z.infer<typeof mintFormSchema>;

function MintNFTSection(props: {
  mint: (values: MintFormValues) => Promise<void>;
  isErc721: boolean;
  isSequentialTokenIdInstalled: boolean;
}) {
  const form = useForm<MintFormValues>({
    values: {
      quantity: "",
      recipient: "",
    },
    reValidateMode: "onChange",
  });

  const mintMutation = useMutation({
    mutationFn: props.mint,
  });

  const onSubmit = async () => {
    const values = form.getValues();
    if (!props.isErc721 && !values.tokenId) {
      form.setError("tokenId", { message: "Token ID is required" });
      return;
    }
    const promise = mintMutation.mutateAsync(values);
    toast.promise(promise, {
      success: "Successfully minted NFT",
      error: (error) => `Failed to mint NFT: ${error}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          {/* Other options */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>quantity</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!props.isErc721 && (
              <FormField
                control={form.control}
                name="tokenId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Token ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              className="min-w-24 gap-2"
              disabled={mintMutation.isPending}
              type="submit"
            >
              {mintMutation.isPending && <Spinner className="size-4" />}
              Mint
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ClaimableModule;
