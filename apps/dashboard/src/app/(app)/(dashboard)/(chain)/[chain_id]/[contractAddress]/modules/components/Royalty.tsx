"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { sendAndConfirmTransaction, type ThirdwebClient } from "thirdweb";
import { RoyaltyERC721, RoyaltyERC1155 } from "thirdweb/modules";
import { useReadContract } from "thirdweb/react";
import { z } from "zod";
import { TransactionButton } from "@/components/tx-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { addressSchema } from "../zod-schemas";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";

function RoyaltyModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const isErc721 = props.contractInfo.name === "RoyaltyERC721";

  const defaultRoyaltyInfoQuery = useReadContract(
    isErc721
      ? RoyaltyERC721.getDefaultRoyaltyInfo
      : RoyaltyERC1155.getDefaultRoyaltyInfo,
    {
      contract: contract,
    },
  );
  const transferValidatorQuery = useReadContract(
    isErc721
      ? RoyaltyERC721.getTransferValidator
      : RoyaltyERC1155.getTransferValidator,
    {
      contract: contract,
    },
  );

  const setRoyaltyInfoForToken = useCallback(
    async (values: RoyaltyInfoFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const setRoyaltyInfoForToken = isErc721
        ? RoyaltyERC721.setRoyaltyInfoForToken
        : RoyaltyERC1155.setRoyaltyInfoForToken;
      const setRoyaltyForTokenTx = setRoyaltyInfoForToken({
        // BPS is 10_000 so we need to multiply by 100
        bps: Number(values.percentage) * 100,
        contract: contract,
        recipient: values.recipient,
        tokenId: BigInt(values.tokenId),
      });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: setRoyaltyForTokenTx,
      });
    },
    [contract, ownerAccount, isErc721],
  );

  const setTransferValidator = useCallback(
    async (values: TransferValidatorFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }
      if (
        values.transferValidator &&
        values.transferValidator !== transferValidatorQuery.data
      ) {
        const setTransferValidator = isErc721
          ? RoyaltyERC721.setTransferValidator
          : RoyaltyERC1155.setTransferValidator;
        const setTransferValidatorTx = setTransferValidator({
          contract: contract,
          validator: values.transferValidator,
        });

        await sendAndConfirmTransaction({
          account: ownerAccount,
          transaction: setTransferValidatorTx,
        });
      }
    },
    [contract, ownerAccount, transferValidatorQuery.data, isErc721],
  );

  const setDefaultRoyaltyInfo = useCallback(
    async (values: DefaultRoyaltyFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }
      const [defaultRoyaltyRecipient, defaultRoyaltyPercentage] =
        defaultRoyaltyInfoQuery.data || [];

      if (
        values.recipient &&
        values.percentage &&
        (values.recipient !== defaultRoyaltyRecipient ||
          Number(values.percentage) * 100 !== defaultRoyaltyPercentage)
      ) {
        const setDefaultRoyaltyInfo = isErc721
          ? RoyaltyERC721.setDefaultRoyaltyInfo
          : RoyaltyERC1155.setDefaultRoyaltyInfo;

        const setSaleConfigTx = setDefaultRoyaltyInfo({
          contract: contract,
          royaltyBps: Number(values.percentage) * 100,
          royaltyRecipient: values.recipient,
        });

        await sendAndConfirmTransaction({
          account: ownerAccount,
          transaction: setSaleConfigTx,
        });
      }
    },
    [contract, ownerAccount, defaultRoyaltyInfoQuery.data, isErc721],
  );

  return (
    <RoyaltyModuleUI
      {...props}
      client={props.contract.client}
      contractChainId={props.contract.chain.id}
      defaultRoyaltyInfo={defaultRoyaltyInfoQuery.data}
      isOwnerAccount={!!ownerAccount}
      isPending={
        transferValidatorQuery.isPending || defaultRoyaltyInfoQuery.isPending
      }
      setDefaultRoyaltyInfo={setDefaultRoyaltyInfo}
      setRoyaltyInfoForToken={setRoyaltyInfoForToken}
      setTransferValidator={setTransferValidator}
      transferValidator={transferValidatorQuery.data}
    />
  );
}

export function RoyaltyModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    isPending: boolean;
    isOwnerAccount: boolean;
    defaultRoyaltyInfo?: readonly [string, number];
    transferValidator?: string;
    setDefaultRoyaltyInfo: (values: DefaultRoyaltyFormValues) => Promise<void>;
    setTransferValidator: (
      values: TransferValidatorFormValues,
    ) => Promise<void>;
    setRoyaltyInfoForToken: (values: RoyaltyInfoFormValues) => Promise<void>;
    contractChainId: number;
    isLoggedIn: boolean;
  },
) {
  return (
    <ModuleCardUI {...props}>
      <div className="h-1" />
      {props.isPending && <Skeleton className="h-[74px]" />}

      {!props.isPending && (
        <Accordion className="-mx-1" collapsible type="single">
          <AccordionItem className="border-none" value="royaltyPerToken">
            <AccordionTrigger className="border-border border-t px-1">
              Royalty Info Per Token
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.isOwnerAccount ? (
                <RoyaltyInfoPerTokenSection
                  client={props.client}
                  contractChainId={props.contractChainId}
                  isLoggedIn={props.isLoggedIn}
                  setRoyaltyInfoForToken={props.setRoyaltyInfoForToken}
                />
              ) : (
                <Alert variant="info">
                  <CircleAlertIcon className="size-5" />
                  <AlertTitle>
                    You don't have permission to set royalty info per token
                  </AlertTitle>
                </Alert>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="border-none" value="default-royalty-info">
            <AccordionTrigger className="border-border border-t px-1">
              Default Royalty Info
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.isOwnerAccount ? (
                <DefaultRoyaltyInfoSection
                  client={props.client}
                  contractChainId={props.contractChainId}
                  defaultRoyaltyInfo={props.defaultRoyaltyInfo}
                  isLoggedIn={props.isLoggedIn}
                  update={props.setDefaultRoyaltyInfo}
                />
              ) : (
                <Alert variant="info">
                  <CircleAlertIcon className="size-5" />
                  <AlertTitle>
                    You don't have permission to set default royalty info
                  </AlertTitle>
                </Alert>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="border-none" value="transfer-validator">
            <AccordionTrigger className="border-border border-t px-1">
              Transfer Validator
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.isOwnerAccount ? (
                <TransferValidatorSection
                  client={props.client}
                  contractChainId={props.contractChainId}
                  isLoggedIn={props.isLoggedIn}
                  transferValidator={props.transferValidator}
                  update={props.setTransferValidator}
                />
              ) : (
                <Alert variant="info">
                  <CircleAlertIcon className="size-5" />
                  <AlertTitle>
                    You don't have permission to set transfer validator
                  </AlertTitle>
                </Alert>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </ModuleCardUI>
  );
}

const royaltyInfoFormSchema = z.object({
  percentage: z
    .string()
    .min(1, { message: "Invalid percentage" })
    .refine((v) => Number(v) === 0 || (Number(v) >= 0.01 && Number(v) <= 100), {
      message: "Invalid percentage",
    }),

  recipient: addressSchema,
  tokenId: z.string().refine((v) => v.length > 0 && Number(v) >= 0, {
    message: "Invalid tokenId",
  }),
});

export type RoyaltyInfoFormValues = z.infer<typeof royaltyInfoFormSchema>;

function RoyaltyInfoPerTokenSection(props: {
  setRoyaltyInfoForToken: (values: RoyaltyInfoFormValues) => Promise<void>;
  contractChainId: number;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const form = useForm<RoyaltyInfoFormValues>({
    resolver: zodResolver(royaltyInfoFormSchema),
    reValidateMode: "onChange",
    values: {
      percentage: "",
      recipient: "",
      tokenId: "",
    },
  });

  const setRoyaltyInfoForTokenNotifications = useTxNotifications(
    "Successfully set royalty info for token",
    "Failed to set royalty info for token",
  );

  const setRoyaltyInfoForTokenMutation = useMutation({
    mutationFn: props.setRoyaltyInfoForToken,
    onError: setRoyaltyInfoForTokenNotifications.onError,
    onSuccess: setRoyaltyInfoForTokenNotifications.onSuccess,
  });

  const onSubmit = async () => {
    setRoyaltyInfoForTokenMutation.mutateAsync(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="tokenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient</FormLabel>
                <FormControl>
                  <Input placeholder="0x..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentage</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input {...field} className="rounded-r-none border-r-0" />
                    <div className="h-10 rounded-lg rounded-l-none border border-input px-3 py-2">
                      %
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-4 flex justify-end">
            <TransactionButton
              className="min-w-24"
              client={props.client}
              disabled={setRoyaltyInfoForTokenMutation.isPending}
              isLoggedIn={props.isLoggedIn}
              isPending={setRoyaltyInfoForTokenMutation.isPending}
              size="sm"
              transactionCount={1}
              txChainID={props.contractChainId}
              type="submit"
            >
              Update
            </TransactionButton>
          </div>
        </div>
      </form>
    </Form>
  );
}

const defaultRoyaltyFormSchema = z.object({
  percentage: z
    .string()
    .min(1, { message: "Invalid percentage" })
    .refine((v) => Number(v) === 0 || (Number(v) >= 0.01 && Number(v) <= 100), {
      message: "Invalid percentage",
    }),
  recipient: addressSchema,
});

export type DefaultRoyaltyFormValues = z.infer<typeof defaultRoyaltyFormSchema>;

function DefaultRoyaltyInfoSection(props: {
  defaultRoyaltyInfo?: readonly [string, number];
  update: (values: DefaultRoyaltyFormValues) => Promise<void>;
  contractChainId: number;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const [defaultRoyaltyRecipient, defaultRoyaltyPercentage] =
    props.defaultRoyaltyInfo || [];

  const form = useForm<DefaultRoyaltyFormValues>({
    resolver: zodResolver(defaultRoyaltyFormSchema),
    reValidateMode: "onChange",
    values: {
      percentage: defaultRoyaltyPercentage
        ? String(defaultRoyaltyPercentage / 100)
        : "",
      recipient: defaultRoyaltyRecipient || "",
    },
  });

  const updateNotifications = useTxNotifications(
    "Successfully set default royalty info",
    "Failed to update default royalty info",
  );

  const updateMutation = useMutation({
    mutationFn: props.update,
    onError: updateNotifications.onError,
    onSuccess: updateNotifications.onSuccess,
  });

  const onSubmit = async () => {
    updateMutation.mutateAsync(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Royalty Recipient</FormLabel>
                <FormControl>
                  <Input placeholder="0x..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Royalty Percentage</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input {...field} className="rounded-r-none border-r-0" />
                    <div className="h-10 rounded-lg rounded-l-none border border-input px-3 py-2">
                      %
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-4 flex justify-end">
            <TransactionButton
              className="min-w-24"
              client={props.client}
              disabled={updateMutation.isPending}
              isLoggedIn={props.isLoggedIn}
              isPending={updateMutation.isPending}
              size="sm"
              transactionCount={1}
              txChainID={props.contractChainId}
              type="submit"
            >
              Update
            </TransactionButton>
          </div>
        </div>
      </form>
    </Form>
  );
}

const transferValidatorFormSchema = z.object({
  transferValidator: addressSchema,
});

export type TransferValidatorFormValues = z.infer<
  typeof transferValidatorFormSchema
>;

function TransferValidatorSection(props: {
  transferValidator: string | undefined;
  update: (values: TransferValidatorFormValues) => Promise<void>;
  contractChainId: number;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const form = useForm<TransferValidatorFormValues>({
    resolver: zodResolver(transferValidatorFormSchema),
    reValidateMode: "onChange",
    values: {
      transferValidator: props.transferValidator || "",
    },
  });

  const updateNotifications = useTxNotifications(
    "Successfully set transfer validator",
    "Failed to set transfer validator",
  );

  const updateMutation = useMutation({
    mutationFn: props.update,
    onError: updateNotifications.onError,
    onSuccess: updateNotifications.onSuccess,
  });

  const onSubmit = async () => {
    updateMutation.mutateAsync(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-1" />

        <FormField
          control={form.control}
          name="transferValidator"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Transfer Validator</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-2" />

        <div className="mt-4 flex justify-end">
          <TransactionButton
            className="min-w-24 gap-2"
            client={props.client}
            disabled={updateMutation.isPending}
            isLoggedIn={props.isLoggedIn}
            isPending={updateMutation.isPending}
            size="sm"
            transactionCount={1}
            txChainID={props.contractChainId}
            type="submit"
          >
            Update
          </TransactionButton>
        </div>
      </form>
    </Form>
  );
}

export default RoyaltyModule;
