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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PropertiesFormControl } from "components/contract-pages/forms/properties.shared";
import { CircleAlertIcon, Trash2Icon } from "lucide-react";
import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type PreparedTransaction, sendAndConfirmTransaction } from "thirdweb";
import { isAddress } from "thirdweb";
import { ClaimableERC721, ClaimableERC1155 } from "thirdweb/modules";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { z } from "zod";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";
import { AdvancedNFTMetadataFormGroup } from "./nft/AdvancedNFTMetadataFormGroup";
import { NFTMediaFormGroup } from "./nft/NFTMediaFormGroup";

const zodAddress = z.string().refine(
  (v) => {
    if (isAddress(v)) {
      return true;
    }
    return false;
  },
  { message: "Invalid Address" },
);

const mintFormSchema = z.object({
  useNextTokenId: z.boolean().optional(),
  tokenId: z.bigint().optional(),
  quantity: z.number().min(0),
  recipient: zodAddress,
});

export type MintFormValues = z.infer<typeof mintFormSchema>;

const MAX_UINT256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
);

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
        const tokenId = values.useNextTokenId ? MAX_UINT256 : values.tokenId;
        mintTx = ClaimableERC1155.mint({
          contract,
          to: values.recipient,
          quantity: values.quantity,
          tokenId,
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

      let setClaimConditionTx: PreparedTransaction;
      if (isErc721) {
        setClaimConditionTx = ClaimableERC721.setClaimCondition({
          contract,
          ...values,
        });
      } else if (values.tokenId) {
        setClaimConditionTx = ClaimableERC1155.setClaimCondition({
          contract,
          tokenId: BigInt(values.tokenId),
          ...values,
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
                    // TODO: remove this
                    isBatchMetadataInstalled={false}
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
              <AccordionTrigger className="border-border border-t px-1">
                Claim Conditions & Primary Sale Recipient
              </AccordionTrigger>
              <AccordionContent className="px-1">
                <ConfigSection
                  isOwnerAccount={props.isOwnerAccount}
                  primarySaleRecipient={props.primarySaleRecipient}
                  claimCondition={props.claimCondition}
                  update={props.update}
                  isErc721={props.isErc721}
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
  primarySaleRecipient: zodAddress,

  tokenId: z.number().optional(),

  pricePerToken: z.number().min(0),
  currencyAddress: zodAddress,

  maxClaimableSupply: z.string().refine((v) => v.length > 0 && Number(v) >= 0, {
    message: "Invalid max claimable supply",
  }),
  maxClaimablePerWallet: z
    .string()
    .refine((v) => v.length > 0 && Number(v) >= 0, {
      message: "Invalid max claimable per wallet",
    }),

  startTime: z.date(),
  endTime: z.date(),

  allowList: z.array(z.object({ address: zodAddress })),
});

export type ConfigFormValues = z.infer<typeof configFormSchema>;

function ConfigSection(props: {
  primarySaleRecipient: string | undefined;
  claimCondition: ClaimCondition | undefined;
  update: (values: ConfigFormValues) => Promise<void>;
  isOwnerAccount: boolean;
  isErc721: boolean;
}) {
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    values: {
      primarySaleRecipient: props.primarySaleRecipient ?? "",
      // TODO: parse units based on the currency decimals
      pricePerToken: props.claimCondition?.pricePerUnit ? 0 : 0,
      currencyAddress: props.claimCondition?.currency ?? "",
      maxClaimableSupply:
        props.claimCondition?.availableSupply.toString() ?? "",
      maxClaimablePerWallet:
        props.claimCondition?.maxMintPerWallet.toString() ?? "",
      startTime: new Date((props.claimCondition?.startTimestamp ?? 0) * 1000),
      endTime: new Date((props.claimCondition?.endTimestamp ?? 0) * 1000),
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
    }
    const promise = updateMutation.mutateAsync(form.getValues());
    toast.promise(promise, {
      success:
        "Successfully updated claim conditions or primary sale recipient",
      error: "Failed to update claim conditions or primary sale recipient",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="tokenId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Token ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={!props.isOwnerAccount}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primarySaleRecipient"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormDescription>
                    The wallet address that should receive the revenue from
                    initial sales of the assets.
                  </FormDescription>
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

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="pricePerToken"
              render={({ field }) => (
                <FormItem>
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

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="maxClaimableSupply"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Maximum number of mints per wallet</FormLabel>
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

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
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
          </div>

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
          </div>

          <div className="mt-4 flex justify-end">
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

function MintNFTSection(props: {
  mint: (values: MintFormValues) => Promise<void>;
  isErc721: boolean;
  isBatchMetadataInstalled: boolean;
  isSequentialTokenIdInstalled: boolean;
}) {
  const form = useForm<MintFormValues>({
    values: {
      supply: 1,
      customImage: "",
      customAnimationUrl: "",
      recipient: "",
      quantity: 1,
    },
    reValidateMode: "onChange",
  });

  const mintMutation = useMutation({
    mutationFn: props.mint,
  });

  const onSubmit = async () => {
    const promise = mintMutation.mutateAsync(form.getValues());
    toast.promise(promise, {
      success: "Successfully minted NFT",
      error: "Failed to mint NFT",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          {props.isBatchMetadataInstalled && (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left */}
              <div className="shrink-0 lg:w-[300px]">
                <NFTMediaFormGroup form={form} previewMaxWidth="300px" />
              </div>

              {/* Right */}
              <div className="flex grow flex-col gap-6">
                {/* name  */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TODO - convert to shadcn + tailwind */}
                <PropertiesFormControl
                  watch={form.watch}
                  errors={form.formState.errors}
                  control={form.control}
                  register={form.register}
                  setValue={form.setValue}
                />

                {/* Advanced options */}
                <Accordion
                  type="single"
                  collapsible={
                    !(
                      form.formState.errors.background_color ||
                      form.formState.errors.external_url
                    )
                  }
                >
                  <AccordionItem
                    value="advanced-options"
                    className="-mx-1 border-t border-b-0"
                  >
                    <AccordionTrigger className="px-1">
                      Advanced Options
                    </AccordionTrigger>
                    <AccordionContent className="px-1">
                      <AdvancedNFTMetadataFormGroup form={form} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          )}

          <Separator />

          {/* Other options */}
          <div className="flex flex-col gap-4 md:flex-row">
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

            {!props.isErc721 && (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>quantity</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {!props.isErc721 && !props.isSequentialTokenIdInstalled && (
              <FormField
                control={form.control}
                name="tokenId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Token ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
