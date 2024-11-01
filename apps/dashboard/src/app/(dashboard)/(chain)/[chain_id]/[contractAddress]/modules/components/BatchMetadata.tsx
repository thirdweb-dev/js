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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { PropertiesFormControl } from "components/contract-pages/forms/properties.shared";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendAndConfirmTransaction } from "thirdweb";
import { BatchMetadataERC721 } from "thirdweb/modules";
import type { NFTMetadataInputLimited } from "types/modified-types";
import { parseAttributes } from "utils/parseAttributes";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";
import { AdvancedNFTMetadataFormGroup } from "./nft/AdvancedNFTMetadataFormGroup";
import { NFTMediaFormGroup } from "./nft/NFTMediaFormGroup";

export type UploadMetadataFormValues = NFTMetadataInputLimited & {
  supply: number;
  customImage: string;
  customAnimationUrl: string;
  tokenId?: string;
};

export function BatchMetadataModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const uploadMetadata = useCallback(
    async (values: UploadMetadataFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const nft = parseAttributes(values);
      const uploadMetadataTx = BatchMetadataERC721.uploadMetadata({
        contract,
        metadatas: [nft],
      });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: uploadMetadataTx,
      });
    },
    [contract, ownerAccount],
  );

  return (
    <BatchMetadataModuleUI
      {...props}
      uploadMetadata={uploadMetadata}
      isOwnerAccount={!!ownerAccount}
    />
  );
}

export function BatchMetadataModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    isOwnerAccount: boolean;
    uploadMetadata: (values: UploadMetadataFormValues) => Promise<void>;
  },
) {
  return (
    <ModuleCardUI {...props}>
      <div className="h-1" />

      <div className="flex flex-col gap-4">
        {/* uploadMetadata NFT */}
        <Accordion type="single" collapsible className="-mx-1">
          <AccordionItem value="metadata" className="border-none">
            <AccordionTrigger className="border-border border-t px-1">
              uploadMetadata NFT
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.isOwnerAccount && (
                <UploadMetadataNFTSection
                  uploadMetadata={props.uploadMetadata}
                />
              )}
              {!props.isOwnerAccount && (
                <Alert variant="info">
                  <CircleAlertIcon className="size-5" />
                  <AlertTitle>
                    You don't have permission to uploadMetadata NFTs on this
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
}) {
  const form = useForm<UploadMetadataFormValues>({
    values: {
      supply: 1,
      customImage: "",
      customAnimationUrl: "",
    },
    reValidateMode: "onChange",
  });

  const uploadMetadataMutation = useMutation({
    mutationFn: props.uploadMetadata,
  });

  const onSubmit = async () => {
    const promise = uploadMetadataMutation.mutateAsync(form.getValues());
    toast.promise(promise, {
      success: "Successfully uploadMetadataed NFT",
      error: "Failed to uploadMetadata NFT",
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

          <div className="flex justify-end">
            <Button
              size="sm"
              className="min-w-24 gap-2"
              disabled={uploadMetadataMutation.isPending}
              type="submit"
            >
              {uploadMetadataMutation.isPending && (
                <Spinner className="size-4" />
              )}
              uploadMetadata
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default BatchMetadataModule;
