"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { type PreparedTransaction, sendAndConfirmTransaction } from "thirdweb";
import { MintableERC721, MintableERC1155 } from "thirdweb/modules";
import { grantRoles, hasAllRoles } from "thirdweb/modules";
import { useReadContract } from "thirdweb/react";
import type { NFTMetadataInputLimited } from "types/modified-types";
import { parseAttributes } from "utils/parseAttributes";
import { z } from "zod";
import { addressSchema } from "../zod-schemas";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";
import { AdvancedNFTMetadataFormGroup } from "./nft/AdvancedNFTMetadataFormGroup";
import { NFTMediaFormGroup } from "./nft/NFTMediaFormGroup";
import { PropertiesFormControl } from "./nft/PropertiesFormControl";

export type UpdateFormValues = {
  primarySaleRecipient: string;
};

export type MintFormValues = NFTMetadataInputLimited & {
  useNextTokenId: boolean;
  recipient: string;
  amount: number;
  customImage: string;
  customAnimationUrl: string;
  attributes: { trait_type: string; value: string }[];
  tokenId?: string;
};

const isValidNft = (values: MintFormValues) =>
  values.name ||
  values.description ||
  values.image ||
  values.animation_url ||
  values.external_url ||
  values.customAnimationUrl;

const MINTER_ROLE = 1n;

function MintableModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const isErc721 = props.contractInfo.name === "MintableERC721";

  const primarySaleRecipientQuery = useReadContract(
    isErc721 ? MintableERC721.getSaleConfig : MintableERC1155.getSaleConfig,
    {
      contract: contract,
    },
  );
  const hasMinterRole = useReadContract(hasAllRoles, {
    contract: contract,
    user: ownerAccount?.address || "",
    roles: MINTER_ROLE,
  });

  const isBatchMetadataInstalled = !!props.allModuleContractInfo.find(
    (module) => module.name.includes("BatchMetadata"),
  );

  const mint = useCallback(
    async (values: MintFormValues) => {
      const nft = isValidNft(values) ? parseAttributes(values) : "";
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      if (!hasMinterRole.data) {
        const grantRoleTx = grantRoles({
          contract,
          user: ownerAccount.address,
          roles: MINTER_ROLE,
        });

        await sendAndConfirmTransaction({
          account: ownerAccount,
          transaction: grantRoleTx,
        });
      }

      let mintTx: PreparedTransaction;
      if (isErc721) {
        mintTx = MintableERC721.mintWithRole({
          contract,
          to: values.recipient,
          nfts: [nft],
        });
      } else if (values.useNextTokenId || values.tokenId) {
        mintTx = MintableERC1155.mintWithRole({
          contract,
          to: values.recipient,
          amount: BigInt(values.amount),
          tokenId: values.tokenId ? BigInt(values.tokenId) : undefined,
          nft,
        });
      } else {
        throw new Error("Invalid token ID");
      }

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: mintTx,
      });
    },
    [contract, ownerAccount, isErc721, hasMinterRole.data],
  );

  const update = useCallback(
    async (values: UpdateFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const setSaleConfig = isErc721
        ? MintableERC721.setSaleConfig
        : MintableERC1155.setSaleConfig;
      const setSaleConfigTx = setSaleConfig({
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
    <MintableModuleUI
      {...props}
      isPending={primarySaleRecipientQuery.isPending}
      primarySaleRecipient={primarySaleRecipientQuery.data}
      updatePrimaryRecipient={update}
      mint={mint}
      isOwnerAccount={!!ownerAccount}
      isErc721={isErc721}
      isBatchMetadataInstalled={isBatchMetadataInstalled}
      contractChainId={contract.chain.id}
    />
  );
}

export function MintableModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    primarySaleRecipient: string | undefined;
    isPending: boolean;
    isOwnerAccount: boolean;
    updatePrimaryRecipient: (values: UpdateFormValues) => Promise<void>;
    mint: (values: MintFormValues) => Promise<void>;
    isErc721: boolean;
    isBatchMetadataInstalled: boolean;
    contractChainId: number;
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
                    isBatchMetadataInstalled={props.isBatchMetadataInstalled}
                    contractChainId={props.contractChainId}
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
                Primary Sale Recipient
              </AccordionTrigger>
              <AccordionContent className="px-1">
                <PrimarySalesSection
                  isOwnerAccount={props.isOwnerAccount}
                  primarySaleRecipient={props.primarySaleRecipient}
                  update={props.updatePrimaryRecipient}
                  contractChainId={props.contractChainId}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </ModuleCardUI>
  );
}

const primarySaleRecipientFormSchema = z.object({
  primarySaleRecipient: addressSchema,
});

function PrimarySalesSection(props: {
  primarySaleRecipient: string | undefined;
  update: (values: UpdateFormValues) => Promise<void>;
  isOwnerAccount: boolean;
  contractChainId: number;
}) {
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(primarySaleRecipientFormSchema),
    values: {
      primarySaleRecipient: props.primarySaleRecipient ?? "",
    },
  });

  const updateNotifications = useTxNotifications(
    "Successfully updated primary sale recipient",
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
            <FormItem>
              <FormDescription>
                The wallet address that should receive the revenue from initial
                sales of the assets.
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

        <div className="mt-4 flex justify-end">
          <TransactionButton
            size="sm"
            className="min-w-24"
            disabled={updateMutation.isPending || !props.isOwnerAccount}
            type="submit"
            isLoading={updateMutation.isPending}
            colorScheme="primary"
            transactionCount={1}
            txChainID={props.contractChainId}
          >
            Update
          </TransactionButton>
        </div>
      </form>{" "}
    </Form>
  );
}

const mintFormSchema = z.object({
  useNextTokenId: z.boolean(),
  customImage: z.string().optional(),
  customAnimationUrl: z.string().optional(),
  recipient: addressSchema,
  tokenId: z.coerce.number().min(0, { message: "Invalid tokenId" }).optional(),
});

function MintNFTSection(props: {
  mint: (values: MintFormValues) => Promise<void>;
  isErc721: boolean;
  isBatchMetadataInstalled: boolean;
  contractChainId: number;
}) {
  const form = useForm<MintFormValues>({
    resolver: zodResolver(mintFormSchema),
    values: {
      useNextTokenId: false,
      customImage: "",
      customAnimationUrl: "",
      recipient: "",
      attributes: [{ trait_type: "", value: "" }],
      amount: 1,
    },
    reValidateMode: "onChange",
  });

  const mintNotifications = useTxNotifications(
    "Successfully minted NFT",
    "Failed to mint NFT",
  );

  const mintMutation = useMutation({
    mutationFn: props.mint,
    onSuccess: mintNotifications.onSuccess,
    onError: mintNotifications.onError,
  });

  const onSubmit = async () => {
    const values = form.getValues();
    if (!props.isErc721 && !values.useNextTokenId && !values.tokenId) {
      form.setError("tokenId", { message: "Token ID is required" });
      return;
    }
    mintMutation.mutateAsync(values);
  };

  const useNextTokenId = form.watch("useNextTokenId");

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

                <PropertiesFormControl form={form} />

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
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {!props.isErc721 && (
              <div className="relative flex-1">
                <FormField
                  control={form.control}
                  name="tokenId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Token ID</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={useNextTokenId} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useNextTokenId"
                  render={({ field }) => (
                    <FormItem className="absolute top-0 right-0 flex items-center gap-2">
                      <CheckboxWithLabel>
                        <Checkbox
                          className="mt-0"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        Use next token ID
                      </CheckboxWithLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <TransactionButton
              size="sm"
              className="min-w-24"
              disabled={mintMutation.isPending}
              type="submit"
              isLoading={mintMutation.isPending}
              colorScheme="primary"
              txChainID={props.contractChainId}
              transactionCount={1}
            >
              Mint
            </TransactionButton>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default MintableModule;
