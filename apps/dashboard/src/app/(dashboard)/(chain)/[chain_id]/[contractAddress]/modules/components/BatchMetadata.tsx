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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { sendAndConfirmTransaction } from "thirdweb";
import { BatchMetadataERC721, BatchMetadataERC1155 } from "thirdweb/modules";
import { parseAttributes } from "utils/parseAttributes";
import { z } from "zod";
import { fileBufferOrStringSchema } from "../zod-schemas";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";
import { AdvancedNFTMetadataFormGroup } from "./nft/AdvancedNFTMetadataFormGroup";
import { NFTMediaFormGroup } from "./nft/NFTMediaFormGroup";
import { PropertiesFormControl } from "./nft/PropertiesFormControl";

const uploadMetadataFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: fileBufferOrStringSchema.optional(),
  animationUri: fileBufferOrStringSchema.optional(),
  external_url: fileBufferOrStringSchema.optional(),
  customImage: z.string().optional(),
  customAnimationUrl: z.string().optional(),
  background_color: z
    .string()
    .refine(
      (c) => {
        return /^#[0-9a-f]{6}$/i.test(c.toLowerCase());
      },
      {
        message: "Invalid Hex Color",
      },
    )
    .optional(),
  attributes: z.array(
    z.object({
      trait_type: z.string().min(1),
      value: z.string().min(1),
    }),
  ),
});

export type UploadMetadataFormValues = z.infer<typeof uploadMetadataFormSchema>;

function BatchMetadataModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const uploadMetadata = useCallback(
    async (values: UploadMetadataFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const nft = parseAttributes(values);
      const uploadMetadata =
        props.contractInfo.name === "BatchMetadataERC721"
          ? BatchMetadataERC721.uploadMetadata
          : BatchMetadataERC1155.uploadMetadata;
      const uploadMetadataTx = uploadMetadata({
        contract,
        metadatas: [nft],
      });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: uploadMetadataTx,
      });
    },
    [contract, ownerAccount, props.contractInfo.name],
  );

  return (
    <BatchMetadataModuleUI
      {...props}
      uploadMetadata={uploadMetadata}
      isOwnerAccount={!!ownerAccount}
      contractChainId={contract.chain.id}
    />
  );
}

export function BatchMetadataModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    isOwnerAccount: boolean;
    uploadMetadata: (values: UploadMetadataFormValues) => Promise<void>;
    contractChainId: number;
  },
) {
  return (
    <ModuleCardUI {...props}>
      <div className="flex flex-col gap-4">
        <Accordion type="single" collapsible className="-mx-1">
          {/* uploadMetadata  */}
          <AccordionItem value="metadata" className="border-none">
            <AccordionTrigger className="border-border border-t px-1">
              Upload NFT Metadata
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.isOwnerAccount && (
                <UploadMetadataNFTSection
                  uploadMetadata={props.uploadMetadata}
                  contractChainId={props.contractChainId}
                />
              )}
              {!props.isOwnerAccount && (
                <Alert variant="info">
                  <CircleAlertIcon className="size-5" />
                  <AlertTitle>
                    You don't have permission to upload metadata on this
                    contract
                  </AlertTitle>
                </Alert>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* batchMetadata  */}
          <AccordionItem value="batch-metadata" className="border-none">
            <AccordionTrigger className="border-border border-t px-1">
              Batch Upload NFT Metadata
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.isOwnerAccount && <BatchMetadataNFTSection />}
              {!props.isOwnerAccount && (
                <Alert variant="info">
                  <CircleAlertIcon className="size-5" />
                  <AlertTitle>
                    You don't have permission to upload metadata on this
                    contract
                  </AlertTitle>
                </Alert>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ModuleCardUI>
  );
}

function UploadMetadataNFTSection(props: {
  uploadMetadata: (values: UploadMetadataFormValues) => Promise<void>;
  contractChainId: number;
}) {
  const form = useForm<UploadMetadataFormValues>({
    resolver: zodResolver(uploadMetadataFormSchema),
    values: {
      name: "",
      attributes: [],
    },
    reValidateMode: "onChange",
  });

  const uploadNotifications = useTxNotifications(
    "NFT metadata uploaded successfully",
    "Failed to uploadMetadata NFT metadata",
  );

  const uploadMetadataMutation = useMutation({
    mutationFn: props.uploadMetadata,
    onSuccess: uploadNotifications.onSuccess,
    onError: uploadNotifications.onError,
  });

  const onSubmit = async () => {
    uploadMetadataMutation.mutateAsync(form.getValues());
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
                  className="-mx-1 border-y"
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

          <div className="flex justify-end">
            <TransactionButton
              size="sm"
              className="min-w-24"
              disabled={uploadMetadataMutation.isPending}
              type="submit"
              isPending={uploadMetadataMutation.isPending}
              txChainID={props.contractChainId}
              transactionCount={1}
            >
              Upload
            </TransactionButton>
          </div>
        </div>
      </form>
    </Form>
  );
}

function BatchMetadataNFTSection() {
  return (
    <Alert variant="info">
      <CircleAlertIcon className="size-5" />
      <AlertTitle>Coming soon!</AlertTitle>
    </Alert>
  );
}

export default BatchMetadataModule;
