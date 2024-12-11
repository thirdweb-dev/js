"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
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
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
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

const MINT_FORM_ID = "nft-mint-form";

type NFTMintForm = {
  contract: ThirdwebContract;
  isErc721: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  twAccount: Account | undefined;
};

export const NFTMintForm: React.FC<NFTMintForm> = ({
  contract,
  isErc721,
  setOpen,
  twAccount,
}) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const {
    setValue,
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<
    NFTMetadataInputLimited & {
      supply: number;
      customImage: string;
      customAnimationUrl: string;
    }
  >();

  const setFile = (file: File) => {
    if (file.type.includes("image")) {
      // image files
      setValue("image", file);
      if (watch("external_url") instanceof File) {
        setValue("external_url", undefined);
      }
      if (watch("animation_url") instanceof File) {
        setValue("animation_url", undefined);
      }
    } else if (
      ["audio", "video", "text/html", "model/*"].some((type: string) =>
        file.type.includes(type),
      ) ||
      file.name?.endsWith(".glb") ||
      file.name?.endsWith(".usdz") ||
      file.name?.endsWith(".gltf") ||
      file.name.endsWith(".obj")
    ) {
      // audio, video, html, and glb (3d) files
      setValue("animation_url", file);
      if (watch("external_url") instanceof File) {
        setValue("external_url", undefined);
      }
    } else if (
      ["text", "application/pdf"].some((type: string) =>
        file.type?.includes(type),
      )
    ) {
      // text and pdf files
      setValue("external_url", file);
      if (watch("animation_url") instanceof File) {
        setValue("animation_url", undefined);
      }
    }
  };

  const imageUrl = useImageFileOrUrl(watch("image") as File | string);
  const mediaFileUrl =
    watch("animation_url") instanceof File
      ? watch("animation_url")
      : watch("external_url") instanceof File
        ? watch("external_url")
        : watch("image") instanceof File
          ? imageUrl
          : undefined;

  const mediaFileError =
    watch("animation_url") instanceof File
      ? errors?.animation_url
      : watch("external_url") instanceof File
        ? errors?.external_url
        : watch("image") instanceof File
          ? errors?.image
          : undefined;

  const externalUrl = watch("external_url");
  const externalIsTextFile =
    externalUrl instanceof File &&
    (externalUrl.type.includes("text") || externalUrl.type.includes("pdf"));

  const showCoverImageUpload =
    watch("animation_url") instanceof File ||
    watch("external_url") instanceof File;

  const sendAndConfirmTx = useSendAndConfirmTransaction();

  return (
    <>
      <form
        className="mt-6 flex flex-col gap-6"
        id={MINT_FORM_ID}
        onSubmit={handleSubmit((data) => {
          if (!address) {
            toast.error("Please connect your wallet to mint.");
            return;
          }

          try {
            const dataWithCustom = {
              ...data,
              image: data.image || data.customImage,
              animation_url: data.animation_url || data.customAnimationUrl,
            };

            trackEvent({
              category: "nft",
              action: "mint",
              label: "attempt",
            });
            const nft = parseAttributes(dataWithCustom);
            const transaction = isErc721
              ? erc721MintTo({ contract, to: address, nft })
              : erc1155MintTo({
                  contract,
                  to: address,
                  nft,
                  supply: BigInt(data.supply),
                });
            const promise = sendAndConfirmTx.mutateAsync(transaction, {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "mint",
                  label: "success",
                });
                setOpen(false);
              },
              // biome-ignore lint/suspicious/noExplicitAny: FIXME
              onError: (error: any) => {
                trackEvent({
                  category: "nft",
                  action: "mint",
                  label: "error",
                  error,
                });
              },
            });

            toast.promise(promise, {
              loading: "Minting NFT",
              success: "NFT minted successfully",
              error: "Failed to mint NFT",
            });
          } catch (err) {
            console.error(err);
            toast.error("Failed to mint NFT");
          }
        })}
      >
        <div className="flex flex-col gap-2">
          <Heading size="subtitle.md">Metadata</Heading>
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
              value={mediaFileUrl as File | string}
              showUploadButton
              showPreview={true}
              setValue={setFile}
              className="rounded border border-border transition-all duration-200"
              selectOrUpload="Upload"
              helperText="Media"
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
              accept={{ "image/*": [] }}
              value={imageUrl}
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
        {!isErc721 && (
          <FormControl isRequired isInvalid={!!errors.supply}>
            <FormLabel>Initial Supply</FormLabel>
            <Input
              type="number"
              step="1"
              pattern="[0-9]"
              {...register("supply")}
            />
            <FormErrorMessage>{errors?.supply?.message}</FormErrorMessage>
          </FormControl>
        )}
        <PropertiesFormControl
          watch={watch}
          // biome-ignore lint/suspicious/noExplicitAny: FIXME
          errors={errors as any}
          control={control}
          register={register}
          setValue={setValue}
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
            <AccordionPanel className="flex flex-col gap-6 px-0">
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
              {!externalIsTextFile && (
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
              <FormControl isInvalid={!!errors.customImage}>
                <FormLabel>Image URL</FormLabel>
                <Input max="6" {...register("customImage")} />
                <FormHelperText>
                  If you already have your NFT image preuploaded, you can set
                  the URL or URI here.
                </FormHelperText>
                <FormErrorMessage>
                  {errors?.customImage?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.customAnimationUrl}>
                <FormLabel>Animation URL</FormLabel>
                <Input max="6" {...register("customAnimationUrl")} />
                <FormHelperText>
                  If you already have your NFT Animation URL preuploaded, you
                  can set the URL or URI here.
                </FormHelperText>
                <FormErrorMessage>
                  {errors?.customAnimationUrl?.message}
                </FormErrorMessage>
              </FormControl>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </form>
      <div className="mt-8 flex flex-row justify-end gap-3">
        <Button
          isDisabled={sendAndConfirmTx.isPending}
          variant="outline"
          mr={3}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <TransactionButton
          txChainID={contract.chain.id}
          transactionCount={1}
          isPending={sendAndConfirmTx.isPending}
          form={MINT_FORM_ID}
          type="submit"
          disabled={!isDirty}
          twAccount={twAccount}
        >
          Mint NFT
        </TransactionButton>
      </div>
    </>
  );
};
