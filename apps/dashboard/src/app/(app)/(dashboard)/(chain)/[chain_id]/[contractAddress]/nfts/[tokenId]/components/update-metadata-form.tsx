"use client";

import { type Dispatch, type SetStateAction, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { NFT, ThirdwebContract } from "thirdweb";
import {
  updateMetadata as updateMetadata721,
  updateTokenURI as updateTokenURI721,
} from "thirdweb/extensions/erc721";
import {
  updateMetadata as updateMetadata1155,
  updateTokenURI as updateTokenURI1155,
} from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import type { NFTMetadata } from "thirdweb/utils";
import { OpenSeaPropertyBadge } from "@/components/badges/opensea";
import { FileInput } from "@/components/blocks/FileInput";
import { PropertiesFormControl } from "@/components/contracts/properties.shared";
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
import { useTxNotifications } from "@/hooks/useTxNotifications";
import type { NFTMetadataInputLimited } from "@/types/modified-types";
import { parseAttributes } from "@/utils/parseAttributes";
import {
  getUploadedNFTMediaMeta,
  handleNFTMediaUpload,
} from "../../../modules/components/nft/handleNFTMediaUpload";

const UPDATE_METADATA_FORM_ID = "nft-update-metadata-form";

type UpdateNftMetadataForm = {
  contract: ThirdwebContract;
  nft: NFT;
  setOpen: Dispatch<SetStateAction<boolean>>;
  /**
   * If useUpdateMetadata (NFT Drop, Edition Drop) -> use `updateMetadata`
   * else (NFT Collection, Edition) -> use `setTokenURI`
   */
  useUpdateMetadata: boolean;
  isLoggedIn: boolean;
};

export function UpdateNftMetadata({
  contract,
  nft,
  useUpdateMetadata,
  setOpen,
  isLoggedIn,
}: UpdateNftMetadataForm) {
  const address = useActiveAccount()?.address;

  const transformedQueryData = useMemo(() => {
    const nftMetadata: Partial<NFTMetadata> = {
      animation_url: nft.metadata.animation_url,
      attributes: nft.metadata.attributes,
      background_color: nft.metadata.background_color || "",
      description: nft.metadata.description || "",
      // advanced
      external_url: nft.metadata.external_url || "",
      // media
      image: nft.metadata.image,
      // basic
      name: nft.metadata.name || "",
    };

    return nftMetadata;
  }, [nft]);

  const form = useForm<NFTMetadataInputLimited>({
    defaultValues: transformedQueryData,
    values: transformedQueryData,
  });

  const {
    setValue,
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const setFile = (file: File) => {
    handleNFTMediaUpload({ file, form });
  };
  const {
    media,
    image,
    mediaFileError,
    showCoverImageUpload,
    animation_url,
    external_url,
  } = getUploadedNFTMediaMeta(form);

  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const updateMetadataNotifications = useTxNotifications(
    "NFT metadata updated successfully",
    "Failed to update NFT metadata",
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        id={UPDATE_METADATA_FORM_ID}
        onSubmit={handleSubmit(async (data) => {
          if (!address) {
            toast.error("Please connect your wallet to update metadata.");
            return;
          }

          try {
            const newMetadata = parseAttributes({
              ...data,
              animation_url: data.animation_url || nft.metadata.animation_url,
              image: data.image || nft.metadata.image,
            });

            const transaction = useUpdateMetadata
              ? // For Drop contracts, we need to call the `updateBatchBaseURI` method
                nft.type === "ERC721"
                ? updateMetadata721({
                    contract,
                    newMetadata,
                    targetTokenId: BigInt(nft.id),
                  })
                : updateMetadata1155({
                    contract,
                    newMetadata,
                    targetTokenId: BigInt(nft.id),
                  })
              : // For Collection contracts, we need to call the `setTokenURI` method
                nft.type === "ERC721"
                ? updateTokenURI721({
                    contract,
                    newMetadata,
                    tokenId: BigInt(nft.id),
                  })
                : updateTokenURI1155({
                    contract,
                    newMetadata,
                    tokenId: BigInt(nft.id),
                  });
            await sendAndConfirmTx.mutateAsync(transaction, {
              onError: (error) => {
                console.error(error);
              },
              onSuccess: () => {
                setOpen(false);
              },
            });

            updateMetadataNotifications.onSuccess();
          } catch (err) {
            console.error(err);
            updateMetadataNotifications.onError(err);
          }
        })}
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoFocus {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Media</FormLabel>
          <div className="flex flex-row flex-wrap gap-3">
            <FileInput
              className="shrink-0 rounded border border-border transition-all duration-200"
              client={contract.client}
              helperText={nft?.metadata ? "New Media" : "Media"}
              previewMaxWidth="200px"
              selectOrUpload="Upload"
              setValue={setFile}
              showPreview
              showUploadButton
              value={media}
            />
          </div>
          <FormDescription>
            You can upload image, audio, video, html, text, pdf, and 3d model
            files here.
          </FormDescription>
          {mediaFileError && (
            <FormMessage>
              {mediaFileError.message as unknown as string}
            </FormMessage>
          )}
        </FormItem>

        {showCoverImageUpload && (
          <FormField
            control={control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <FileInput
                    accept={{ "image/*": [] }}
                    className="rounded border border-border transition-all"
                    client={contract.client}
                    previewMaxWidth="200px"
                    setValue={(file) => {
                      setValue("image", file);
                    }}
                    showUploadButton
                    value={image}
                  />
                </FormControl>
                <FormDescription>
                  You can optionally upload an image as the cover of your NFT.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PropertiesFormControl
          client={contract.client}
          control={control}
          // biome-ignore lint/suspicious/noExplicitAny: FIXME
          errors={errors as any}
          register={register}
          setValue={setValue}
          watch={watch}
        />

        <Accordion
          type="single"
          className="-mx-1 border-t border-border"
          collapsible
          defaultValue={
            errors.background_color || errors.external_url
              ? "advanced"
              : undefined
          }
        >
          <AccordionItem value="advanced">
            <AccordionTrigger className="justify-between px-1">
              <h3 className="text-base font-medium">Advanced Options</h3>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-6 px-1">
              <FormField
                control={control}
                name="background_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Background Color <OpenSeaPropertyBadge />
                    </FormLabel>
                    <FormControl>
                      <Input max="6" {...field} className="bg-card" />
                    </FormControl>
                    <FormDescription>
                      Must be a six-character hexadecimal with a pre-pended #.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!(external_url instanceof File) && (
                <FormField
                  control={control}
                  name="external_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        External URL <OpenSeaPropertyBadge />
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-card"
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        This is the URL that will appear below the asset&apos;s
                        image on OpenSea and will allow users to leave OpenSea
                        and view the item on your site.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!(image instanceof File) && (
                <FormField
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            setValue("image", e.target.value);
                          }}
                          value={typeof image === "string" ? image : ""}
                          className="bg-card"
                        />
                      </FormControl>
                      <FormDescription>
                        If you already have your NFT image pre-uploaded to a
                        URL, you can specify it here instead of uploading the
                        media file
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!(animation_url instanceof File) && (
                <FormField
                  control={control}
                  name="animation_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Animation URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            setValue("animation_url", e.target.value);
                          }}
                          value={
                            typeof animation_url === "string"
                              ? animation_url
                              : ""
                          }
                          className="bg-card"
                        />
                      </FormControl>
                      <FormDescription>
                        If you already have your NFT Animation URL pre-uploaded
                        to a URL, you can specify it here instead of uploading
                        the media file
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 flex flex-row justify-end gap-3">
          <Button
            disabled={sendAndConfirmTx.isPending}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <TransactionButton
            client={contract.client}
            form={UPDATE_METADATA_FORM_ID}
            isLoggedIn={isLoggedIn}
            isPending={sendAndConfirmTx.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Update NFT
          </TransactionButton>
        </div>
      </form>
    </Form>
  );
}
