"use client";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PropertiesFormControl } from "components/contract-pages/forms/properties.shared";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendAndConfirmTransaction } from "thirdweb";
import { isAddress } from "thirdweb";
import { MintableERC721, MintableERC1155 } from "thirdweb/modules";
import { useReadContract } from "thirdweb/react";
import type { NFTMetadataInputLimited } from "types/modified-types";
import { parseAttributes } from "utils/parseAttributes";
import { z } from "zod";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";
import { AdvancedNFTMetadataFormGroup } from "./nft/AdvancedNFTMetadataFormGroup";
import { NFTMediaFormGroup } from "./nft/NFTMediaFormGroup";

export type UpdateFormValues = {
  primarySaleRecipient: string;
};

// TODO - add form validation with zod schema for mint form

export type MintFormValues = NFTMetadataInputLimited & {
  recipient: string;
  amount: number;
  supply: number;
  customImage: string;
  customAnimationUrl: string;
};

function MintableModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const primarySaleRecipientQuery = useReadContract(
    MintableERC721.getSaleConfig,
    {
      contract: contract,
    },
  );

  const isErc721 = props.contractInfo.name === "MintableERC721";

  const mint = useCallback(
    async (values: MintFormValues) => {
      const nft = parseAttributes(values);
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const mintTx = isErc721
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
    [contract, ownerAccount, isErc721],
  );

  const update = useCallback(
    async (values: UpdateFormValues) => {
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
      updatePrimaryRecipient={update}
      mint={mint}
      isOwnerAccount={!!ownerAccount}
      showAmount={!isErc721}
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
    showAmount: boolean;
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
                    showAmount={props.showAmount}
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
  primarySaleRecipient: z.string().refine(
    (v) => {
      // don't return `isAddress(v)` directly to avoid typecasting address as `0x${string}`
      if (isAddress(v)) {
        return true;
      }
      return false;
    },
    {
      message: "Invalid Address",
    },
  ),
});

function PrimarySalesSection(props: {
  primarySaleRecipient: string | undefined;
  update: (values: UpdateFormValues) => Promise<void>;
  isOwnerAccount: boolean;
}) {
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(primarySaleRecipientFormSchema),
    values: {
      primarySaleRecipient: props.primarySaleRecipient ?? "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: props.update,
  });

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
          <Button
            size="sm"
            className="min-w-24 gap-2"
            disabled={updateMutation.isPending}
            type="submit"
          >
            {updateMutation.isPending && <Spinner className="size-4" />}
            Update
          </Button>
        </div>
      </form>{" "}
    </Form>
  );
}

function MintNFTSection(props: {
  mint: (values: MintFormValues) => Promise<void>;
  showAmount: boolean;
}) {
  const form = useForm<MintFormValues>({
    values: {
      supply: 1,
      customImage: "",
      customAnimationUrl: "",
      recipient: "",
      amount: 1,
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

          <Separator />

          {/* Other options */}
          <div
            className={cn(
              "grid gap-4",
              props.showAmount ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1",
            )}
          >
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {props.showAmount && (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
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

export default MintableModule;
