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
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { sendAndConfirmTransaction } from "thirdweb";
import { BatchMetadataERC721 } from "thirdweb/modules";
import type { NFTMetadataInputLimited } from "types/modified-types";
import { parseAttributes } from "utils/parseAttributes";
import { useTxNotifications } from "../../../../../../../hooks/useTxNotifications";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";
import { AdvancedNFTMetadataFormGroup } from "./nft/AdvancedNFTMetadataFormGroup";
import { NFTMediaFormGroup } from "./nft/NFTMediaFormGroup";
import { PropertiesFormControl } from "./nft/PropertiesFormControl";

// TODO: add form validation on the upload form
// TODO: this module currently shows the UI for doing a single upload, but it should be batch upload UI

export type UploadMetadataFormValues = NFTMetadataInputLimited & {
  supply: number;
  customImage: string;
  customAnimationUrl: string;
  attributes: { trait_type: string; value: string }[];
  tokenId?: string;
};

function BatchMetadataModule(props: ModuleInstanceProps) {
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
  // TODO: add form validation here
  const form = useForm<UploadMetadataFormValues>({
    values: {
      supply: 1,
      customImage: "",
      customAnimationUrl: "",
      attributes: [{ trait_type: "", value: "" }],
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
            <Button
              size="sm"
              className="min-w-24 gap-2"
              disabled={uploadMetadataMutation.isPending}
              type="submit"
            >
              {uploadMetadataMutation.isPending && (
                <Spinner className="size-4" />
              )}
              Upload
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default BatchMetadataModule;
