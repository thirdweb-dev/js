"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { addDays, fromUnixTime } from "date-fns";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CircleAlertIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  NATIVE_TOKEN_ADDRESS,
  type PreparedTransaction,
  ZERO_ADDRESS,
  getContract,
  sendAndConfirmTransaction,
  toTokens,
} from "thirdweb";
import { decimals } from "thirdweb/extensions/erc20";
import {
  ClaimableERC20,
  ClaimableERC721,
  ClaimableERC1155,
} from "thirdweb/modules";
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

const positiveIntegerRegex = /^[0-9]\d*$/;

function ClaimableModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;
  const account = useActiveAccount();
  const [tokenId, setTokenId] = useState<string>("");

  const isValidTokenId = positiveIntegerRegex.test(tokenId);

  const primarySaleRecipientQuery = useReadContract(
    props.contractInfo.name === "ClaimableERC721"
      ? ClaimableERC721.getSaleConfig
      : props.contractInfo.name === "ClaimableERC20"
        ? ClaimableERC20.getSaleConfig
        : ClaimableERC1155.getSaleConfig,
    {
      contract: contract,
    },
  );

  const claimConditionQuery = useReadContract(
    props.contractInfo.name === "ClaimableERC721"
      ? ClaimableERC721.getClaimCondition
      : props.contractInfo.name === "ClaimableERC20"
        ? ClaimableERC20.getClaimCondition
        : ClaimableERC1155.getClaimCondition,
    {
      tokenId: positiveIntegerRegex.test(tokenId) ? BigInt(tokenId) : 0n,
      contract: contract,
      queryOptions: {
        enabled:
          ["ClaimableERC721", "ClaimableERC20"].includes(
            props.contractInfo.name,
          ) ||
          (!!tokenId && isValidTokenId),
      },
    },
  );

  const noClaimConditionSet =
    claimConditionQuery.data?.availableSupply === 0n &&
    claimConditionQuery.data?.allowlistMerkleRoot ===
      "0x0000000000000000000000000000000000000000000000000000000000000000" &&
    claimConditionQuery.data?.pricePerUnit === 0n &&
    claimConditionQuery.data?.currency === ZERO_ADDRESS &&
    claimConditionQuery.data?.maxMintPerWallet === 0n &&
    claimConditionQuery.data?.startTimestamp === 0 &&
    claimConditionQuery.data?.endTimestamp === 0;

  const currencyContract = getContract({
    address: claimConditionQuery.data?.currency || "",
    chain: props.contract.chain,
    client: props.contract.client,
  });

  const shouldFetchTokenDecimals =
    claimConditionQuery.data &&
    claimConditionQuery.data?.currency !== ZERO_ADDRESS;

  const currencyDecimalsQuery = useReadContract(decimals, {
    contract: currencyContract,
    queryOptions: {
      enabled: shouldFetchTokenDecimals,
    },
  });
  const tokenDecimalsQuery = useReadContract(decimals, {
    contract: contract,
    queryOptions: {
      enabled: props.contractInfo.name === "ClaimableERC20",
    },
  });

  const mint = useCallback(
    async (values: MintFormValues) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      let mintTx: PreparedTransaction;
      if (props.contractInfo.name === "ClaimableERC721") {
        mintTx = ClaimableERC721.mint({
          contract,
          to: values.recipient,
          quantity: values.quantity,
        });
      } else if (props.contractInfo.name === "ClaimableERC20") {
        mintTx = ClaimableERC20.mint({
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
    [contract, account, props.contractInfo.name],
  );

  const setClaimCondition = useCallback(
    async (values: ClaimConditionFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      let setClaimConditionTx: PreparedTransaction;
      if (props.contractInfo.name === "ClaimableERC721") {
        setClaimConditionTx = ClaimableERC721.setClaimCondition({
          ...values,
          contract,
          allowList:
            values.allowList && values.allowList.length > 0
              ? values.allowList.map(({ address }) => address)
              : undefined,
        });
      } else if (props.contractInfo.name === "ClaimableERC20") {
        setClaimConditionTx = ClaimableERC20.setClaimCondition({
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
    [contract, ownerAccount, props.contractInfo.name],
  );

  const setPrimarySaleRecipient = useCallback(
    async (values: PrimarySaleRecipientFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }
      const setSaleConfig =
        props.contractInfo.name === "ClaimableERC721"
          ? ClaimableERC721.setSaleConfig
          : props.contractInfo.name === "ClaimableERC20"
            ? ClaimableERC20.setSaleConfig
            : ClaimableERC1155.setSaleConfig;
      const setSaleConfigTx = setSaleConfig({
        contract: contract,
        primarySaleRecipient: values.primarySaleRecipient,
      });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: setSaleConfigTx,
      });
    },
    [contract, ownerAccount, props.contractInfo.name],
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
          // claim conditions data is present
          claimConditionQuery.data &&
          // token decimals is fetched if it should be fetched
          (shouldFetchTokenDecimals ? currencyDecimalsQuery.isFetched : true)
            ? {
                claimCondition: claimConditionQuery.data,
                currencyDecimals: currencyDecimalsQuery.data,
                tokenDecimals: tokenDecimalsQuery.data,
              }
            : undefined,
        setClaimCondition,
        tokenId,
        isLoading:
          claimConditionQuery.isLoading ||
          (!!shouldFetchTokenDecimals && currencyDecimalsQuery.isLoading),
      }}
      isOwnerAccount={!!ownerAccount}
      name={props.contractInfo.name}
      contractChainId={props.contract.chain.id}
      setTokenId={setTokenId}
      isValidTokenId={isValidTokenId}
      noClaimConditionSet={noClaimConditionSet}
      mintSection={{
        mint,
      }}
    />
  );
}

export function ClaimableModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    isOwnerAccount: boolean;
    name: string;
    contractChainId: number;
    setTokenId: Dispatch<SetStateAction<string>>;
    isValidTokenId: boolean;
    noClaimConditionSet: boolean;
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
      tokenId: string;
      setClaimCondition: (values: ClaimConditionFormValues) => Promise<void>;
      data:
        | {
            claimCondition: ClaimConditionValue;
            currencyDecimals: number | undefined;
            tokenDecimals: number | undefined;
          }
        | undefined;
      isLoading: boolean;
    };
    twAccount: Account | undefined;
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
              Mint {props.name === "ClaimableERC20" ? "Token" : "NFT"}
            </AccordionTrigger>
            <AccordionContent className="px-1">
              <MintNFTSection
                mint={props.mintSection.mint}
                name={props.name}
                contractChainId={props.contractChainId}
                twAccount={props.twAccount}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="claim-conditions" className="border-none ">
            <AccordionTrigger className="border-border border-t px-1 text-left">
              Claim Conditions
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.name === "ClaimableERC1155" && (
                <div className="flex flex-col gap-6">
                  <div className="flex-1 space-y-1">
                    <Label>Token ID</Label>
                    <p className="text-muted-foreground text-sm">
                      {props.isOwnerAccount
                        ? "View and Update claim conditions for given token ID"
                        : "View claim conditions for given token ID"}
                    </p>
                    <Input onChange={(e) => props.setTokenId(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="h-6" />

              {props.name !== "ClaimableERC1155" || props.isValidTokenId ? (
                props.claimConditionSection.data ? (
                  <ClaimConditionSection
                    twAccount={props.twAccount}
                    isOwnerAccount={props.isOwnerAccount}
                    claimCondition={
                      props.claimConditionSection.data.claimCondition
                    }
                    update={props.claimConditionSection.setClaimCondition}
                    name={props.name}
                    chainId={props.contractChainId}
                    noClaimConditionSet={props.noClaimConditionSet}
                    currencyDecimals={
                      props.claimConditionSection.data?.currencyDecimals
                    }
                    tokenDecimals={
                      props.claimConditionSection.data?.tokenDecimals
                    }
                    tokenId={props.claimConditionSection.tokenId}
                  />
                ) : (
                  <Skeleton className="h-[350px]" />
                )
              ) : null}
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
                  twAccount={props.twAccount}
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
  claimCondition: ClaimConditionValue;
  update: (values: ClaimConditionFormValues) => Promise<void>;
  isOwnerAccount: boolean;
  name: string;
  chainId: number;
  currencyDecimals?: number;
  tokenDecimals?: number | undefined;
  tokenId: string;
  noClaimConditionSet: boolean;
  twAccount: Account | undefined;
}) {
  const { idToChain } = useAllChainsData();
  const chain = idToChain.get(props.chainId);
  const { tokenId, claimCondition } = props;
  const [addClaimConditionButtonClicked, setAddClaimConditionButtonClicked] =
    useState(false);

  const form = useForm<ClaimConditionFormValues>({
    resolver: zodResolver(claimConditionFormSchema),
    values: {
      tokenId,
      currencyAddress:
        claimCondition?.currency === ZERO_ADDRESS
          ? NATIVE_TOKEN_ADDRESS // default to the native token address
          : claimCondition?.currency,
      // default case is zero state, so 0 // 10 ** 18 still results in 0
      pricePerToken: Number(
        toTokens(claimCondition?.pricePerUnit, props.currencyDecimals || 18),
      ),
      maxClaimableSupply:
        claimCondition?.availableSupply.toString() === "0" ||
        claimCondition?.availableSupply.toString() === MAX_UINT_256
          ? ""
          : props.name === "ClaimableERC20"
            ? toTokens(
                claimCondition?.availableSupply,
                props.tokenDecimals || 18,
              )
            : claimCondition?.availableSupply.toString() || "",
      maxClaimablePerWallet:
        claimCondition?.maxMintPerWallet.toString() === "0" ||
        claimCondition?.maxMintPerWallet.toString() === MAX_UINT_256
          ? ""
          : props.name === "ClaimableERC20"
            ? toTokens(
                claimCondition?.maxMintPerWallet,
                props.tokenDecimals || 18,
              )
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
    if (props.name === "ClaimableERC1155" && !values.tokenId) {
      form.setError("tokenId", { message: "Token ID is required" });
      return;
    }
    updateMutation.mutateAsync(values);
  };

  return (
    <div className="flex flex-col gap-6">
      {props.noClaimConditionSet && !addClaimConditionButtonClicked && (
        <>
          <Alert variant="warning">
            <CircleAlertIcon className="size-5 max-sm:hidden" />
            <AlertTitle>No Claim Condition Set</AlertTitle>
            <AlertDescription>
              You have not set a claim condition for this token. You can set a
              claim condition by clicking the "Set Claim Condition" button.
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => setAddClaimConditionButtonClicked(true)}
            variant="outline"
            className="w-full"
          >
            Add Claim Condition
          </Button>
        </>
      )}

      {(!props.noClaimConditionSet || addClaimConditionButtonClicked) && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
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
                  twAccount={props.twAccount}
                  size="sm"
                  className="min-w-24"
                  disabled={updateMutation.isPending || !props.isOwnerAccount}
                  type="submit"
                  isPending={updateMutation.isPending}
                  txChainID={props.chainId}
                  transactionCount={1}
                >
                  Update
                </TransactionButton>
              </div>
            </div>
          </form>{" "}
        </Form>
      )}
    </div>
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
  twAccount: Account | undefined;
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
            twAccount={props.twAccount}
            size="sm"
            className="min-w-24 gap-2"
            disabled={
              updateMutation.isPending ||
              !props.isOwnerAccount ||
              !form.formState.isDirty
            }
            type="submit"
            isPending={updateMutation.isPending}
            txChainID={props.contractChainId}
            transactionCount={1}
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
  name: string;
  contractChainId: number;
  twAccount: Account | undefined;
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
    if (props.name === "ClaimableERC1155" && !values.tokenId) {
      form.setError("tokenId", { message: "Token ID is required" });
      return;
    }
    mintMutation.mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
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
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {props.name === "ClaimableERC1155" && (
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

          <div className="flex justify-end">
            <TransactionButton
              size="sm"
              className="min-w-24 gap-2"
              disabled={mintMutation.isPending}
              type="submit"
              isPending={mintMutation.isPending}
              txChainID={props.contractChainId}
              transactionCount={1}
              twAccount={props.twAccount}
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
