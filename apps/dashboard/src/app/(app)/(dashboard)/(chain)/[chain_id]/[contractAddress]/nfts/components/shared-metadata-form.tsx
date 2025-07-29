"use client";

import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { setSharedMetadata } from "thirdweb/extensions/erc721";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { FileInput } from "@/components/blocks/FileInput";
import { TransactionButton } from "@/components/tx-button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { NFTMetadataInputLimited } from "@/types/modified-types";
import { parseError } from "@/utils/errorParser";
import { parseAttributes } from "@/utils/parseAttributes";
import {
  getUploadedNFTMediaMeta,
  handleNFTMediaUpload,
} from "../../modules/components/nft/handleNFTMediaUpload";

export function SharedMetadataForm({
  contract,
  setOpen,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
}) {
  const address = useActiveAccount()?.address;
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const form = useForm<NFTMetadataInputLimited>();

  const setFile = (file: File) => {
    handleNFTMediaUpload({ file, form });
  };

  const { media, image, mediaFileError, showCoverImageUpload, animation_url } =
    getUploadedNFTMediaMeta(form);

  return (
    <Form {...form}>
      <form
        className="mt-4 space-y-6"
        onSubmit={form.handleSubmit(async (data) => {
          if (!address) {
            toast.error("Please connect your wallet.");
            return;
          }

          const dataWithCustom = {
            ...data,
            animation_url: data.animation_url,
            image: data.image,
          };

          const transaction = setSharedMetadata({
            contract,
            nft: parseAttributes(dataWithCustom),
          });
          await sendAndConfirmTx.mutateAsync(transaction, {
            onError: (error) => {
              toast.error("Failed to update shared metadata", {
                description: parseError(error),
              });
            },
            onSuccess: () => {
              toast.success("Shared metadata updated successfully");
              setOpen(false);
            },
          });
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className="bg-card" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Media</FormLabel>
          <div>
            <FileInput
              className="shrink-0 bg-card rounded-lg border border-border transition-all duration-200"
              client={contract.client}
              helperText="Media"
              previewMaxWidth="200px"
              selectOrUpload="Upload"
              setValue={setFile}
              showPreview={true}
              showUploadButton
              value={media}
            />
          </div>
          <FormDescription>
            You can upload image, audio, video, html, text, pdf, and 3d model
            files here.
          </FormDescription>
          {mediaFileError && (
            <FormMessage>{mediaFileError.message}</FormMessage>
          )}
        </FormItem>

        {showCoverImageUpload && (
          <FormItem>
            <FormLabel>Cover Image</FormLabel>
            <FileInput
              accept={{ "image/*": [] }}
              className="shrink-0 bg-card rounded-lg border border-border transition-all"
              client={contract.client}
              previewMaxWidth="200px"
              setValue={(file) =>
                form.setValue("image", file, {
                  shouldValidate: true,
                })
              }
              showUploadButton
              value={image}
            />
            <FormDescription>
              You can optionally upload an image as the cover of your NFT.
            </FormDescription>
          </FormItem>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="bg-card" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion
          type="single"
          collapsible
          className="-mx-1 border-t border-border"
        >
          <AccordionItem value="advanced-options">
            <AccordionTrigger className="justify-between px-1">
              <h3 className="text-base font-medium">Advanced Options</h3>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-6 px-1">
              {!(image instanceof File) && (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    className="bg-card"
                    onChange={(e) => {
                      form.setValue("image", e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                    value={image}
                  />
                  <FormDescription>
                    If you already have your NFT image pre-uploaded, you can set
                    the URL or URI here.
                  </FormDescription>
                </FormItem>
              )}

              {!(animation_url instanceof File) && (
                <FormItem>
                  <FormLabel>Animation URL</FormLabel>
                  <Input
                    className="bg-card"
                    onChange={(e) => {
                      form.setValue("animation_url", e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                    value={animation_url}
                  />
                  <FormDescription>
                    If you already have your NFT Animation URL pre-uploaded, you
                    can set the URL or URI here.
                  </FormDescription>
                </FormItem>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 flex flex-row justify-end gap-3">
          <Button
            disabled={sendAndConfirmTx.isPending}
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <TransactionButton
            client={contract.client}
            isLoggedIn={isLoggedIn}
            isPending={sendAndConfirmTx.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Set NFT Metadata
          </TransactionButton>
        </div>
      </form>
    </Form>
  );
}
