"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendAndConfirmTransaction } from "thirdweb";
import { MintableERC721, MintableERC1155 } from "thirdweb/modules";
import { useReadContract } from "thirdweb/react";
import type { NFTMetadataInputLimited } from "types/modified-types";
import { parseAttributes } from "utils/parseAttributes";
import { MetadataUpload } from "./MetadataUpload";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";

export type MetadataUploadFormValues = NFTMetadataInputLimited & {
  supply: number;
  customImage: string;
  customAnimationUrl: string;
};

export type MintableModuleFormValues = MetadataUploadFormValues & {
  primarySaleRecipient: string;
  recipient: string;
  amount: number;
};

function MintableModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const primarySaleRecipientQuery = useReadContract(
    MintableERC721.getSaleConfig,
    {
      contract: contract,
    },
  );

  const mint = useCallback(
    async (values: MintableModuleFormValues) => {
      const nft = parseAttributes(values);
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const mintTx =
        props.contractInfo.name === "MintableERC721"
          ? MintableERC721.mintWithRole({
              contract,
              to: values.recipient,
              nfts: [nft],
            })
          : MintableERC1155.mintWithRole({
              contract,
              to: values.recipient,
              amount: BigInt(values.amount),
              nft,
            });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: mintTx,
      });
    },
    [contract, ownerAccount, props.contractInfo.name],
  );

  const update = useCallback(
    async (values: MintableModuleFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const setSaleConfigTx = MintableERC721.setSaleConfig({
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
    <MintableModuleUI
      {...props}
      isPending={primarySaleRecipientQuery.isPending}
      primarySaleRecipient={primarySaleRecipientQuery.data}
      update={update}
      mint={mint}
      isOwnerAccount={!!ownerAccount}
    />
  );
}

export function MintableModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    primarySaleRecipient: string | undefined;
    isPending: boolean;
    isOwnerAccount: boolean;
    update: (values: MintableModuleFormValues) => Promise<void>;
    mint: (values: MintableModuleFormValues) => Promise<void>;
  },
) {
  const form = useForm<MintableModuleFormValues>({
    values: {
      supply: 1,
      customImage: "",
      customAnimationUrl: "",

      // Mintable properties
      primarySaleRecipient: props.primarySaleRecipient || "",
      recipient: "",
      amount: 1,
    },
    reValidateMode: "onChange",
  });

  const mintMutation = useMutation({
    mutationFn: props.mint,
  });

  const updateMutation = useMutation({
    mutationFn: props.update,
  });

  const mint = async () => {
    const promise = mintMutation.mutateAsync(form.getValues());
    toast.promise(promise, {
      success: "Successfully minted NFT",
      error: "Failed to mint NFT",
    });
  };

  const onSubmit = async () => {
    const promise = updateMutation.mutateAsync(form.getValues());
    toast.promise(promise, {
      success: "Successfully updated primary sale recipient",
      error: "Failed to update primary sale recipient",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ModuleCardUI
          {...props}
          updateButton={{
            onClick: onSubmit,
            isPending: updateMutation.isPending,
            isDisabled: !form.formState.isDirty,
          }}
        >
          {props.isPending && <Skeleton className="h-[74px]" />}

          {!props.isPending && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col gap-3">
                      <FormLabel>To Address</FormLabel>
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

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col gap-3">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!props.isOwnerAccount} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="metadata">
                  <AccordionTrigger className="justify-between">
                    Metadata
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-6 px-0">
                    <MetadataUpload
                      form={
                        form as unknown as UseFormReturn<MetadataUploadFormValues>
                      }
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="min-w-24 gap-2"
                  type="button"
                  disabled={mintMutation.isPending}
                  onClick={() => mint()}
                >
                  {mintMutation.isPending && <Spinner className="size-4" />}
                  Mint
                </Button>
              </div>

              <FormField
                control={form.control}
                name="primarySaleRecipient"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col gap-3">
                    <FormLabel>Primary Sale Recipient</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0x..."
                        {...field}
                        disabled={!props.isOwnerAccount}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
        </ModuleCardUI>
      </form>
    </Form>
  );
}

export default MintableModule;
