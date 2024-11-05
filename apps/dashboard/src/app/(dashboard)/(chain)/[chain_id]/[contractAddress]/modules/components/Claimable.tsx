"use client";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
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
import { TransactionButton } from "components/buttons/TransactionButton";
import { addDays, fromUnixTime } from "date-fns";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CircleAlertIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  type PreparedTransaction,
  ZERO_ADDRESS,
  getContract,
  sendAndConfirmTransaction,
  toTokens,
} from "thirdweb";
import { decimals } from "thirdweb/extensions/erc20";
import { ClaimableERC721, ClaimableERC1155 } from "thirdweb/modules";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { z } from "zod";
import { addressSchema } from "../zod-schemas";
import { CurrencySelector } from "./CurrencySelector";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";

export type ClaimConditionValue = {
  availableSupply: bigint;
  allowlistMerkleRoot: `0x${string}`;
  pricePerUnit: bigint;
  currency: string;
  maxMintPerWallet: bigint;
  startTimestamp: number;
  endTimestamp: number;
  auxData: string;
};

// TODO - for erc1155 have a UI something like this:
// - show one input initially - user enters tokenId
// - fetch the claim conditions for that tokenId and show the entire claim condition form with those values if they exist, or show empty form state if they don't exist

// TODO - don't compare with ZERO_ADDRESS we are not getting ZERO_ADDRESS as currency address and instead getting 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE, (checksummed NATIVE_TOKEN_ADDRESS)

// TODO - fix Currency selector not showing the selected currency

function ClaimableModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;
  const account = useActiveAccount();

  const isErc721 = props.contractInfo.name === "ClaimableERC721";

  const primarySaleRecipientQuery = useReadContract(
    isErc721 ? ClaimableERC721.getSaleConfig : ClaimableERC1155.getSaleConfig,
    {
      contract: contract,
    },
  );

  const claimConditionQuery = useReadContract(
    ClaimableERC721.getClaimCondition,
    {
      contract: contract,
      queryOptions: {
        enabled: isErc721,
      },
    },
  );

  const currencyContract = getContract({
    address: claimConditionQuery.data?.currency || "",
    chain: props.contract.chain,
    client: props.contract.client,
  });

  const shouldFetchTokenDecimals =
    isErc721 &&
    claimConditionQuery.data &&
    claimConditionQuery.data?.currency !== ZERO_ADDRESS;

  const tokenDecimalsQuery = useReadContract(decimals, {
    contract: currencyContract,
    queryOptions: {
      enabled: shouldFetchTokenDecimals,
    },
  });

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

  const setClaimCondition = useCallback(
    async (values: ClaimConditionFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

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
    },
    [contract, ownerAccount, isErc721],
  );

  const setPrimarySaleRecipient = useCallback(
    async (values: PrimarySaleRecipientFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }
      const setSaleConfigTx = ClaimableERC721.setSaleConfig({
        contract: contract,
        primarySaleRecipient: values.primarySaleRecipient,
      });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: setSaleConfigTx,
      });
    },
    [contract, ownerAccount],
  );

  return (
    <ClaimableModuleUI
      {...props}
      primarySaleRecipientSection={{
        data: primarySaleRecipientQuery.data
          ? { primarySaleRecipient: primarySaleRecipientQuery.data }
          : undefined,
        setPrimarySaleRecipient,
      }}
      claimConditionSection={{
        data:
          // claim condition is common for all tokens
          isErc721 &&
          // claim conditions is fetched
          claimConditionQuery.isFetched &&
          // token decimals is fetched if it should be fetched
          (shouldFetchTokenDecimals ? tokenDecimalsQuery.isFetched : true)
            ? {
                claimCondition: claimConditionQuery.data,
                tokenDecimals: tokenDecimalsQuery.data,
              }
            : undefined,
        setClaimCondition,
      }}
      isOwnerAccount={!!ownerAccount}
      isErc721={isErc721}
      contractChainId={props.contract.chain.id}
      mintSection={{
        mint,
      }}
    />
  );
}

export function ClaimableModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    isOwnerAccount: boolean;
    isErc721: boolean;
    contractChainId: number;
    primarySaleRecipientSection: {
      setPrimarySaleRecipient: (
        values: PrimarySaleRecipientFormValues,
      ) => Promise<void>;
      data:
        | {
            primarySaleRecipient: string;
          }
        | undefined;
    };
    mintSection: {
      mint: (values: MintFormValues) => Promise<void>;
    };
    claimConditionSection: {
      setClaimCondition: (values: ClaimConditionFormValues) => Promise<void>;
      data:
        | {
            claimCondition: ClaimConditionValue | undefined;
            tokenDecimals: number | undefined;
          }
        | undefined;
    };
  },
) {
  return (
    <ModuleCardUI {...props}>
      <div className="h-1" />

      <div className="flex flex-col gap-4">
        {/* Mint NFT */}
        <Accordion type="single" collapsible className="-mx-1">
          <AccordionItem value="metadata" className="border-none">
            <AccordionTrigger className="border-border border-t px-1">
              Mint NFT
            </AccordionTrigger>
            <AccordionContent className="px-1">
              <MintNFTSection
                mint={props.mintSection.mint}
                isErc721={props.isErc721}
                contractChainId={props.contractChainId}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="claim-conditions" className="border-none ">
            <AccordionTrigger className="border-border border-t px-1 text-left">
              Claim Conditions
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.claimConditionSection.data ? (
                <ClaimConditionSection
                  isOwnerAccount={props.isOwnerAccount}
                  claimCondition={
                    props.claimConditionSection.data.claimCondition
                  }
                  update={props.claimConditionSection.setClaimCondition}
                  isErc721={props.isErc721}
                  chainId={props.contractChainId}
                  tokenDecimals={props.claimConditionSection.data.tokenDecimals}
                />
              ) : (
                <Skeleton className="h-[350px]" />
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="primary-sale-recipient"
            className="border-none "
          >
            <AccordionTrigger className="border-border border-t px-1 text-left">
              Primary Sale Recipient
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.primarySaleRecipientSection.data ? (
                <PrimarySaleRecipientSection
                  isOwnerAccount={props.isOwnerAccount}
                  primarySaleRecipient={
                    props.primarySaleRecipientSection.data.primarySaleRecipient
                  }
                  update={
                    props.primarySaleRecipientSection.setPrimarySaleRecipient
                  }
                  contractChainId={props.contractChainId}
                />
              ) : (
                <Skeleton className="h-[74px]" />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ModuleCardUI>
  );
}

const claimConditionFormSchema = z.object({
  tokenId: z.string().refine((v) => BigInt(v) >= 0n, {
    message: "Invalid tokenId",
  }),
  pricePerToken: z.coerce
    .number()
    .min(0, { message: "Invalid price per token" })
    .optional(),
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

  startTime: z.date(),
  endTime: z.date(),
  allowList: z.array(z.object({ address: addressSchema })).optional(),
});

export type ClaimConditionFormValues = z.infer<typeof claimConditionFormSchema>;

const MAX_UINT_256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

const defaultStartDate = addDays(new Date(), 7);
const defaultEndDate = addDays(new Date(), 14);

function ClaimConditionSection(props: {
  claimCondition: ClaimConditionValue | undefined;
  update: (values: ClaimConditionFormValues) => Promise<void>;
  isOwnerAccount: boolean;
  isErc721: boolean;
  chainId: number;
  tokenDecimals: number | undefined;
}) {
  const { idToChain } = useAllChainsData();
  const chain = idToChain.get(props.chainId);
  const { claimCondition } = props;

  const form = useForm<ClaimConditionFormValues>({
    resolver: zodResolver(claimConditionFormSchema),
    values: {
      tokenId: "",
      currencyAddress:
        claimCondition?.currency === ZERO_ADDRESS
          ? ""
          : claimCondition?.currency,
      pricePerToken:
        claimCondition?.pricePerUnit &&
        claimCondition?.currency !== ZERO_ADDRESS &&
        props.tokenDecimals
          ? Number(toTokens(claimCondition?.pricePerUnit, props.tokenDecimals))
          : 0,
      maxClaimableSupply:
        claimCondition?.availableSupply.toString() === "0" ||
        claimCondition?.availableSupply.toString() === MAX_UINT_256
          ? ""
          : claimCondition?.availableSupply.toString() || "",
      maxClaimablePerWallet:
        claimCondition?.maxMintPerWallet.toString() === "0" ||
        claimCondition?.maxMintPerWallet.toString() === MAX_UINT_256
          ? ""
          : claimCondition?.maxMintPerWallet.toString() || "",
      startTime: claimCondition?.startTimestamp
        ? fromUnixTime(claimCondition?.startTimestamp)
        : defaultStartDate,
      endTime: claimCondition?.endTimestamp
        ? fromUnixTime(claimCondition?.endTimestamp)
        : defaultEndDate,
      allowList: [],
    },
  });
  const allowListFields = useFieldArray({
    control: form.control,
    name: "allowList",
  });

  const updateNotifications = useTxNotifications(
    "Successfully updated claim conditions",
    "Failed to update claim conditions",
  );

  const [startTime, endTime] = form.watch(["startTime", "endTime"]);

  const updateMutation = useMutation({
    mutationFn: props.update,
    onSuccess: updateNotifications.onSuccess,
    onError: updateNotifications.onError,
  });

  const onSubmit = async () => {
    const values = form.getValues();
    if (!props.isErc721 && !values.tokenId) {
      form.setError("tokenId", { message: "Token ID is required" });
      return;
    }
    updateMutation.mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
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
                  <CurrencySelector chain={chain} field={field} />
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

          <FormFieldSetup
            htmlFor="duration"
            label="Duration"
            isRequired
            errorMessage={
              form.formState.errors?.startTime?.message ||
              form.formState.errors?.endTime?.message
            }
          >
            <div>
              <DatePickerWithRange
                from={startTime}
                to={endTime}
                setFrom={(from: Date) => form.setValue("startTime", from)}
                setTo={(to: Date) => form.setValue("endTime", to)}
              />
            </div>
          </FormFieldSetup>

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
            <TransactionButton
              size="sm"
              className="min-w-24"
              disabled={updateMutation.isPending || !props.isOwnerAccount}
              type="submit"
              isLoading={updateMutation.isPending}
              txChainID={props.chainId}
              transactionCount={1}
              colorScheme="primary"
            >
              Update
            </TransactionButton>
          </div>
        </div>
      </form>{" "}
    </Form>
  );
}

const primarySaleRecipientFormSchema = z.object({
  primarySaleRecipient: addressSchema,
});

export type PrimarySaleRecipientFormValues = z.infer<
  typeof primarySaleRecipientFormSchema
>;

function PrimarySaleRecipientSection(props: {
  primarySaleRecipient: string | undefined;
  update: (values: PrimarySaleRecipientFormValues) => Promise<void>;
  isOwnerAccount: boolean;
  contractChainId: number;
}) {
  const form = useForm<PrimarySaleRecipientFormValues>({
    resolver: zodResolver(primarySaleRecipientFormSchema),
    values: {
      primarySaleRecipient: props.primarySaleRecipient || "",
    },
  });

  const updateNotifications = useTxNotifications(
    "Successfully update primary sale recipient",
    "Failed to update primary sale recipient",
  );

  const updateMutation = useMutation({
    mutationFn: props.update,
    onSuccess: updateNotifications.onSuccess,
    onError: updateNotifications.onError,
  });

  const onSubmit = async () => {
    updateMutation.mutateAsync(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        <div className="h-5" />

        <div className="flex justify-end">
          <TransactionButton
            size="sm"
            className="min-w-24 gap-2"
            disabled={updateMutation.isPending || !props.isOwnerAccount}
            type="submit"
            isLoading={updateMutation.isPending}
            txChainID={props.contractChainId}
            transactionCount={1}
            colorScheme="primary"
          >
            Update
          </TransactionButton>
        </div>
      </form>{" "}
    </Form>
  );
}

const mintFormSchema = z.object({
  tokenId: z.string().refine((v) => v.length === 0 || Number(v) >= 0, {
    message: "Invalid tokenId",
  }),
  quantity: z.coerce.number().min(0, { message: "Invalid quantity" }),
  recipient: addressSchema,
});

export type MintFormValues = z.infer<typeof mintFormSchema>;

function MintNFTSection(props: {
  mint: (values: MintFormValues) => Promise<void>;
  isErc721: boolean;
  contractChainId: number;
}) {
  const form = useForm<MintFormValues>({
    resolver: zodResolver(mintFormSchema),
    values: {
      tokenId: "",
      quantity: 0,
      recipient: "",
    },
    reValidateMode: "onChange",
  });

  const updateNotifications = useTxNotifications(
    "Successfully minted NFT",
    "Failed to mint NFT",
  );

  const mintMutation = useMutation({
    mutationFn: props.mint,
    onSuccess: updateNotifications.onSuccess,
    onError: updateNotifications.onError,
  });

  const onSubmit = async () => {
    const values = form.getValues();
    if (!props.isErc721 && !values.tokenId) {
      form.setError("tokenId", { message: "Token ID is required" });
      return;
    }
    mintMutation.mutateAsync(values);
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
            <TransactionButton
              size="sm"
              className="min-w-24 gap-2"
              disabled={mintMutation.isPending}
              type="submit"
              isLoading={mintMutation.isPending}
              txChainID={props.contractChainId}
              transactionCount={1}
              colorScheme="primary"
            >
              Mint
            </TransactionButton>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ClaimableModule;
