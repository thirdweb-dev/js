"use client";

import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { mintTo as erc721MintTo } from "thirdweb/extensions/erc721";
import { mintTo as erc1155MintTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount } from "thirdweb/react";
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
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import type { NFTMetadataInputLimited } from "@/types/modified-types";
import { parseAttributes } from "@/utils/parseAttributes";
import {
  getUploadedNFTMediaMeta,
  handleNFTMediaUpload,
} from "../../modules/components/nft/handleNFTMediaUpload";

const MINT_FORM_ID = "nft-mint-form";

type NFTMintForm = {
  contract: ThirdwebContract;
  isErc721: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
};

export function NFTMintForm({
  contract,
  isErc721,
  setOpen,
  isLoggedIn,
}: NFTMintForm) {
  const address = useActiveAccount()?.address;
  const form = useForm<
    NFTMetadataInputLimited & {
      supply: number;
    }
  >();

  const {
    setValue,
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
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

  const sendAndConfirmTx = useSendAndConfirmTx();
  const nftMintNotifications = useTxNotifications(
    "NFT minted successfully",
    "Failed to mint NFT",
  );

  return (
    <Form {...form}>
      <form
        className="mt-6 flex flex-col gap-6"
        id={MINT_FORM_ID}
        onSubmit={handleSubmit(async ({ supply, ...data }) => {
          if (!address) {
            toast.error("Please connect your wallet to mint.");
            return;
          }

          try {
            const dataWithCustom = {
              ...data,
              animation_url: data.animation_url,
              image: data.image,
            };

            const nft = parseAttributes(dataWithCustom);
            const transaction = isErc721
              ? erc721MintTo({ contract, nft, to: address })
              : erc1155MintTo({
                  contract,
                  nft,
                  supply: BigInt(supply),
                  to: address,
                });
            await sendAndConfirmTx.mutateAsync(transaction, {
              onError: (error) => {
                console.error(error);
              },
              onSuccess: () => {
                setOpen(false);
              },
            });

            nftMintNotifications.onSuccess();
          } catch (err) {
            nftMintNotifications.onError(err);
            console.error(err);
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
          <div>
            <FileInput
              className="shrink-0 rounded border border-border transition-all duration-200"
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
                    className="shrink-0 rounded border border-border transition-all"
                    client={contract.client}
                    previewMaxWidth="200px"
                    setValue={(file) => setValue("image", file)}
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

        {!isErc721 && (
          <FormField
            control={control}
            name="supply"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Supply</FormLabel>
                <FormControl>
                  <Input
                    pattern="[0-9]"
                    step="1"
                    type="number"
                    {...field}
                    className="bg-card"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
            <AccordionContent>
              <div className="flex flex-col gap-6 px-1">
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
                          This is the URL that will appear below the
                          asset&apos;s image on OpenSea and will allow users to
                          leave OpenSea and view the item on your site.
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
                            value={image}
                            className="bg-card"
                          />
                        </FormControl>
                        <FormDescription>
                          If you already have your NFT image pre-uploaded to a
                          URL, you can specify it here instead of uploading the
                          asset
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
                            value={animation_url}
                            className="bg-card"
                          />
                        </FormControl>
                        <FormDescription>
                          If you already have your NFT Animation URL
                          pre-uploaded to a URL, you can specify it here instead
                          of uploading the asset
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 flex flex-row justify-end gap-3">
          <Button
            disabled={sendAndConfirmTx.isPending}
            className="mr-3"
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <TransactionButton
            client={contract.client}
            disabled={!isDirty}
            form={MINT_FORM_ID}
            isLoggedIn={isLoggedIn}
            isPending={sendAndConfirmTx.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Mint NFT
          </TransactionButton>
        </div>
      </form>
    </Form>
  );
}
