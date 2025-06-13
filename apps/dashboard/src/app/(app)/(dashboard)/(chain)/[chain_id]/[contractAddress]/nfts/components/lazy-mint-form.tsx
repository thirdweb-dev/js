"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  FormControl,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { OpenSeaPropertyBadge } from "components/badges/opensea";
import { TransactionButton } from "components/buttons/TransactionButton";
import { PropertiesFormControl } from "components/contract-pages/forms/properties.shared";
import { FileInput } from "components/shared/FileInput";
import { useTxNotifications } from "hooks/useTxNotifications";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { lazyMint as lazyMint721 } from "thirdweb/extensions/erc721";
import { lazyMint as lazyMint1155 } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
} from "tw-components";
import type { NFTMetadataInputLimited } from "types/modified-types";
import { parseAttributes } from "utils/parseAttributes";
import {
  getUploadedNFTMediaMeta,
  handleNFTMediaUpload,
} from "../../modules/components/nft/handleNFTMediaUpload";

const LAZY_MINT_FORM_ID = "nft-lazy-mint-form";

type LazyMintNftFormParams = {
  contract: ThirdwebContract;
  isErc721: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
};

export const LazyMintNftForm: React.FC<LazyMintNftFormParams> = ({
  contract,
  isErc721,
  setOpen,
  isLoggedIn,
}) => {
  const address = useActiveAccount()?.address;
  const sendAndConfirmTx = useSendAndConfirmTransaction();

  const form = useForm<NFTMetadataInputLimited>();

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

  const lazyMintNotifications = useTxNotifications(
    "NFT lazy minted successfully",
    "Failed to lazy mint NFT",
  );

  return (
    <>
      <form
        className="mt-6 flex flex-col gap-6"
        id={LAZY_MINT_FORM_ID}
        onSubmit={handleSubmit(async (data) => {
          if (!address) {
            toast.error("Please connect your wallet to mint.");
            return;
          }
          try {
            const nfts = [parseAttributes(data)];
            const transaction = isErc721
              ? lazyMint721({ contract, nfts })
              : lazyMint1155({ contract, nfts });

            await sendAndConfirmTx.mutateAsync(transaction, {
              onSuccess: () => {
                setOpen(false);
              },
              onError: (error) => {
                console.error(error);
              },
            });

            lazyMintNotifications.onSuccess();
          } catch (err) {
            console.error(err);
            lazyMintNotifications.onError(err);
          }
        })}
      >
        <div className="flex flex-col gap-2">
          <Heading size="subtitle.md">Metadata </Heading>
          <Divider />
        </div>
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input autoFocus {...register("name")} />
          <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!mediaFileError}>
          <FormLabel>Media</FormLabel>
          <div>
            <FileInput
              previewMaxWidth="200px"
              value={media}
              showUploadButton
              showPreview={true}
              setValue={setFile}
              className="rounded border border-border transition-all duration-200"
              selectOrUpload="Upload"
              helperText="Media"
              client={contract.client}
            />
          </div>
          <FormHelperText>
            You can upload image, audio, video, html, text, pdf, and 3d model
            files here.
          </FormHelperText>
          <FormErrorMessage>
            {mediaFileError?.message as unknown as string}
          </FormErrorMessage>
        </FormControl>
        {showCoverImageUpload && (
          <FormControl isInvalid={!!errors.image}>
            <FormLabel>Cover Image</FormLabel>
            <FileInput
              previewMaxWidth="200px"
              client={contract.client}
              accept={{ "image/*": [] }}
              value={image}
              showUploadButton
              setValue={(file) => setValue("image", file)}
              className="rounded border border-border transition-all"
            />
            <FormHelperText>
              You can optionally upload an image as the cover of your NFT.
            </FormHelperText>
            <FormErrorMessage>
              {errors?.image?.message as unknown as string}
            </FormErrorMessage>
          </FormControl>
        )}
        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea {...register("description")} />
          <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
        </FormControl>
        <PropertiesFormControl
          watch={watch}
          // biome-ignore lint/suspicious/noExplicitAny: FIXME
          errors={errors as any}
          control={control}
          register={register}
          setValue={setValue}
          client={contract.client}
        />
        <Accordion
          allowToggle={!(errors.background_color || errors.external_url)}
          index={
            errors.background_color || errors.external_url ? [0] : undefined
          }
        >
          <AccordionItem>
            <AccordionButton px={0} justifyContent="space-between">
              <Heading size="subtitle.md">Advanced Options</Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel className="!px-0 flex flex-col gap-6">
              <FormControl isInvalid={!!errors.background_color}>
                <FormLabel>
                  Background Color <OpenSeaPropertyBadge />
                </FormLabel>
                <Input max="6" {...register("background_color")} />
                <FormHelperText>
                  Must be a six-character hexadecimal with a pre-pended #.
                </FormHelperText>
                <FormErrorMessage>
                  {errors?.background_color?.message}
                </FormErrorMessage>
              </FormControl>

              {!(external_url instanceof File) && (
                <FormControl isInvalid={!!errors.external_url}>
                  <FormLabel>
                    External URL <OpenSeaPropertyBadge />
                  </FormLabel>
                  <Input {...register("external_url")} />
                  <FormHelperText>
                    This is the URL that will appear below the asset&apos;s
                    image on OpenSea and will allow users to leave OpenSea and
                    view the item on your site.
                  </FormHelperText>
                  <FormErrorMessage>
                    {errors?.external_url?.message as unknown as string}
                  </FormErrorMessage>
                </FormControl>
              )}

              {!(image instanceof File) && (
                <FormControl isInvalid={!!errors.image}>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    {...register("image")}
                    value={image}
                    onChange={(e) => {
                      setValue("image", e.target.value);
                    }}
                  />
                  <FormHelperText>
                    If you already have your NFT image pre-uploaded to a URL,
                    you can specify it here instead of uploading the media file
                  </FormHelperText>
                  <FormErrorMessage>{errors?.image?.message}</FormErrorMessage>
                </FormControl>
              )}

              {!(animation_url instanceof File) && (
                <FormControl isInvalid={!!errors.animation_url}>
                  <FormLabel>Animation URL</FormLabel>
                  <Input
                    {...register("animation_url")}
                    value={animation_url}
                    onChange={(e) => {
                      setValue("animation_url", e.target.value);
                    }}
                  />
                  <FormHelperText>
                    If you already have your NFT Animation URL pre-uploaded to a
                    URL, you can specify it here instead of uploading the media
                    file
                  </FormHelperText>
                  <FormErrorMessage>
                    {errors?.animation_url?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </form>
      <div className="mt-8 flex flex-row justify-end gap-3">
        <Button
          disabled={sendAndConfirmTx.isPending}
          variant="outline"
          className="mr-3"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <TransactionButton
          client={contract.client}
          isLoggedIn={isLoggedIn}
          txChainID={contract.chain.id}
          transactionCount={1}
          isPending={sendAndConfirmTx.isPending}
          form={LAZY_MINT_FORM_ID}
          type="submit"
          disabled={!isDirty}
        >
          Lazy Mint NFT
        </TransactionButton>
      </div>
    </>
  );
};
