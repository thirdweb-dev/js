"use client";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  FormControl,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Button } from "chakra/button";
import { FormErrorMessage, FormHelperText, FormLabel } from "chakra/form";
import { Heading } from "chakra/heading";
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

export const UpdateNftMetadata: React.FC<UpdateNftMetadataForm> = ({
  contract,
  nft,
  useUpdateMetadata,
  setOpen,
  isLoggedIn,
}) => {
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

  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const updateMetadataNotifications = useTxNotifications(
    "NFT metadata updated successfully",
    "Failed to update NFT metadata",
  );

  return (
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
      <FormControl isInvalid={!!errors.name} isRequired>
        <FormLabel>Name</FormLabel>
        <Input autoFocus {...register("name")} />
        <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!mediaFileError}>
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
            accept={{ "image/*": [] }}
            className="rounded border border-border transition-all"
            client={contract.client}
            previewMaxWidth="200px"
            setValue={(file) => setValue("image", file)}
            showUploadButton
            value={image}
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
        client={contract.client}
        control={control}
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        errors={errors as any}
        register={register}
        setValue={setValue}
        watch={watch}
      />

      <Accordion
        allowToggle={!(errors.background_color || errors.external_url)}
        index={errors.background_color || errors.external_url ? [0] : undefined}
      >
        <AccordionItem>
          <AccordionButton justifyContent="space-between" px={0}>
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
                  This is the URL that will appear below the asset&apos;s image
                  on OpenSea and will allow users to leave OpenSea and view the
                  item on your site.
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
                  onChange={(e) => {
                    setValue("image", e.target.value);
                  }}
                  value={typeof image === "string" ? image : ""}
                />
                <FormHelperText>
                  If you already have your NFT image pre-uploaded to a URL, you
                  can specify it here instead of uploading the media file
                </FormHelperText>
                <FormErrorMessage>{errors?.image?.message}</FormErrorMessage>
              </FormControl>
            )}

            {!(animation_url instanceof File) && (
              <FormControl isInvalid={!!errors.animation_url}>
                <FormLabel>Animation URL</FormLabel>
                <Input
                  onChange={(e) => {
                    setValue("animation_url", e.target.value);
                  }}
                  value={typeof animation_url === "string" ? animation_url : ""}
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
      <div className="mt-8 flex flex-row justify-end gap-3">
        <Button
          isDisabled={sendAndConfirmTx.isPending}
          onClick={() => setOpen(false)}
          variant="outline"
        >
          Cancel
        </Button>
        <TransactionButton
          client={contract.client}
          disabled={!isDirty}
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
  );
};
