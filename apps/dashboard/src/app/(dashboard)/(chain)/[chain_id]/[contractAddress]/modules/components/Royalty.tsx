"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { sendAndConfirmTransaction } from "thirdweb";
import { RoyaltyERC721, RoyaltyERC1155 } from "thirdweb/modules";
import { useReadContract } from "thirdweb/react";
import { z } from "zod";
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
        contract: contract,
        recipient: values.recipient,
        // BPS is 10_000 so we need to multiply by 100
        bps: Number(values.percentage) * 100,
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
          royaltyRecipient: values.recipient,
          royaltyBps: Number(values.percentage) * 100,
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
      isPending={
        transferValidatorQuery.isPending || defaultRoyaltyInfoQuery.isPending
      }
      transferValidator={transferValidatorQuery.data}
      defaultRoyaltyInfo={defaultRoyaltyInfoQuery.data}
      setDefaultRoyaltyInfo={setDefaultRoyaltyInfo}
      setTransferValidator={setTransferValidator}
      setRoyaltyInfoForToken={setRoyaltyInfoForToken}
      isOwnerAccount={!!ownerAccount}
      contractChainId={props.contract.chain.id}
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
  },
) {
  return (
    <ModuleCardUI {...props}>
      <div className="h-1" />
      {props.isPending && <Skeleton className="h-[74px]" />}

      {!props.isPending && (
        <Accordion type="single" collapsible className="-mx-1">
          <AccordionItem value="royaltyPerToken" className="border-none">
            <AccordionTrigger className="border-border border-t px-1">
              Royalty Info Per Token
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.isOwnerAccount ? (
                <RoyaltyInfoPerTokenSection
                  setRoyaltyInfoForToken={props.setRoyaltyInfoForToken}
                  contractChainId={props.contractChainId}
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

          <AccordionItem value="default-royalty-info" className="border-none">
            <AccordionTrigger className="border-border border-t px-1">
              Default Royalty Info
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.isOwnerAccount ? (
                <DefaultRoyaltyInfoSection
                  update={props.setDefaultRoyaltyInfo}
                  defaultRoyaltyInfo={props.defaultRoyaltyInfo}
                  contractChainId={props.contractChainId}
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

          <AccordionItem value="transfer-validator" className="border-none">
            <AccordionTrigger className="border-border border-t px-1">
              Transfer Validator
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.isOwnerAccount ? (
                <TransferValidatorSection
                  update={props.setTransferValidator}
                  transferValidator={props.transferValidator}
                  contractChainId={props.contractChainId}
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
  tokenId: z.string().refine((v) => v.length > 0 && Number(v) >= 0, {
    message: "Invalid tokenId",
  }),

  recipient: addressSchema,
  percentage: z
    .string()
    .min(1, { message: "Invalid percentage" })
    .refine((v) => Number(v) === 0 || (Number(v) >= 0.01 && Number(v) <= 100), {
      message: "Invalid percentage",
    }),
});

export type RoyaltyInfoFormValues = z.infer<typeof royaltyInfoFormSchema>;

function RoyaltyInfoPerTokenSection(props: {
  setRoyaltyInfoForToken: (values: RoyaltyInfoFormValues) => Promise<void>;
  contractChainId: number;
}) {
  const form = useForm<RoyaltyInfoFormValues>({
    resolver: zodResolver(royaltyInfoFormSchema),
    values: {
      tokenId: "",
      recipient: "",
      percentage: "",
    },
    reValidateMode: "onChange",
  });

  const setRoyaltyInfoForTokenNotifications = useTxNotifications(
    "Successfully set royalty info for token",
    "Failed to set royalty info for token",
  );

  const setRoyaltyInfoForTokenMutation = useMutation({
    mutationFn: props.setRoyaltyInfoForToken,
    onSuccess: setRoyaltyInfoForTokenNotifications.onSuccess,
    onError: setRoyaltyInfoForTokenNotifications.onError,
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
              size="sm"
              className="min-w-24"
              disabled={setRoyaltyInfoForTokenMutation.isPending}
              type="submit"
              isLoading={setRoyaltyInfoForTokenMutation.isPending}
              colorScheme="primary"
              transactionCount={1}
              txChainID={props.contractChainId}
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
  recipient: addressSchema,
  percentage: z
    .string()
    .min(1, { message: "Invalid percentage" })
    .refine((v) => Number(v) === 0 || (Number(v) >= 0.01 && Number(v) <= 100), {
      message: "Invalid percentage",
    }),
});

export type DefaultRoyaltyFormValues = z.infer<typeof defaultRoyaltyFormSchema>;

function DefaultRoyaltyInfoSection(props: {
  defaultRoyaltyInfo?: readonly [string, number];
  update: (values: DefaultRoyaltyFormValues) => Promise<void>;
  contractChainId: number;
}) {
  const [defaultRoyaltyRecipient, defaultRoyaltyPercentage] =
    props.defaultRoyaltyInfo || [];

  const form = useForm<DefaultRoyaltyFormValues>({
    resolver: zodResolver(defaultRoyaltyFormSchema),
    values: {
      recipient: defaultRoyaltyRecipient || "",
      percentage: defaultRoyaltyPercentage
        ? String(defaultRoyaltyPercentage / 100)
        : "",
    },
    reValidateMode: "onChange",
  });

  const updateNotifications = useTxNotifications(
    "Successfully set default royalty info",
    "Failed to update default royalty info",
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
              size="sm"
              className="min-w-24"
              disabled={updateMutation.isPending}
              type="submit"
              colorScheme="primary"
              transactionCount={1}
              isLoading={updateMutation.isPending}
              txChainID={props.contractChainId}
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
}) {
  const form = useForm<TransferValidatorFormValues>({
    resolver: zodResolver(transferValidatorFormSchema),
    values: {
      transferValidator: props.transferValidator || "",
    },
    reValidateMode: "onChange",
  });

  const updateNotifications = useTxNotifications(
    "Successfully set transfer validator",
    "Failed to set transfer validator",
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
            size="sm"
            className="min-w-24 gap-2"
            disabled={updateMutation.isPending}
            type="submit"
            colorScheme="primary"
            isLoading={updateMutation.isPending}
            transactionCount={1}
            txChainID={props.contractChainId}
          >
            Update
          </TransactionButton>
        </div>
      </form>
    </Form>
  );
}

export default RoyaltyModule;
