"use client";

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
import { mintTo as erc721MintTo } from "thirdweb/extensions/erc721";
import { mintTo as erc1155MintTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import {
  Button,
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

const MINT_FORM_ID = "nft-mint-form";

type NFTMintForm = {
  contract: ThirdwebContract;
  isErc721: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
};

export const NFTMintForm: React.FC<NFTMintForm> = ({
  contract,
  isErc721,
  setOpen,
  isLoggedIn,
}) => {
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

  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const nftMintNotifications = useTxNotifications(
    "NFT minted successfully",
    "Failed to mint NFT",
  );

  return (
    <>
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
        <div className="flex flex-col gap-2">
          <Heading size="subtitle.md">Metadata xx</Heading>
          <Divider />
        </div>
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel>Name</FormLabel>
          <Input autoFocus {...register("name")} />
          <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!mediaFileError}>
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
              className="shrink-0 rounded border border-border transition-all"
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
        {!isErc721 && (
          <FormControl isInvalid={!!errors.supply} isRequired>
            <FormLabel>Initial Supply</FormLabel>
            <Input
              pattern="[0-9]"
              step="1"
              type="number"
              {...register("supply")}
            />
            <FormErrorMessage>{errors?.supply?.message}</FormErrorMessage>
          </FormControl>
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
          allowToggle={!(errors.background_color || errors.external_url)}
          index={
            errors.background_color || errors.external_url ? [0] : undefined
          }
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
                    onChange={(e) => {
                      setValue("image", e.target.value);
                    }}
                    value={image}
                  />
                  <FormHelperText>
                    If you already have your NFT image pre-uploaded to a URL,
                    you can specify it here instead of uploading the asset
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
                    value={animation_url}
                  />
                  <FormHelperText>
                    If you already have your NFT Animation URL pre-uploaded to a
                    URL, you can specify it here instead of uploading the asset
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
          isDisabled={sendAndConfirmTx.isPending}
          mr={3}
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
    </>
  );
};
