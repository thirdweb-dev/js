"use client";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  Input,
  Textarea,
  useModalContext,
} from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FileInput } from "components/shared/FileInput";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import { setSharedMetadata } from "thirdweb/extensions/erc721";
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

const SHARED_METADATA_FORM_ID = "shared-metadata-form";

export const SharedMetadataForm: React.FC<{
  contract: ThirdwebContract;
}> = ({ contract }) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const { mutate, isPending } = useSendAndConfirmTransaction();
  const {
    setValue,
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

  const modalContext = useModalContext();
  const { onSuccess, onError } = useTxNotifications(
    "NFT Metadata set successfully",
    "Failed to set NFT Metadata",
    contract,
  );

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

  const showCoverImageUpload =
    watch("animation_url") instanceof File ||
    watch("external_url") instanceof File;

  return (
    <>
      <DrawerHeader>
        <Heading>Set NFT Metadata</Heading>
      </DrawerHeader>
      <DrawerBody>
        <form
          className="flex flex-col gap-6"
          id={SHARED_METADATA_FORM_ID}
          onSubmit={handleSubmit((data) => {
            if (!address) {
              onError("Please connect your wallet.");
              return;
            }

            const dataWithCustom = {
              ...data,
              image: data.image || data.customImage,
              animation_url: data.animation_url || data.customAnimationUrl,
            };

            trackEvent({
              category: "nft",
              action: "set-shared-metadata",
              label: "attempt",
            });
            const transaction = setSharedMetadata({
              contract,
              nft: parseAttributes(dataWithCustom),
            });
            mutate(transaction, {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "set-shared-metadata",
                  label: "success",
                });
                onSuccess();
                modalContext.onClose();
              },
              // biome-ignore lint/suspicious/noExplicitAny: FIXME
              onError: (error: any) => {
                trackEvent({
                  category: "nft",
                  action: "set-shared-metadata",
                  label: "error",
                  error,
                });
                onError(error);
              },
            });
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
      </DrawerBody>
      <DrawerFooter>
        <Button
          isDisabled={isPending}
          variant="outline"
          mr={3}
          onClick={modalContext.onClose}
        >
          Cancel
        </Button>
        <TransactionButton
          txChainID={contract.chain.id}
          transactionCount={1}
          isLoading={isPending}
          form={SHARED_METADATA_FORM_ID}
          type="submit"
          colorScheme="primary"
          isDisabled={!isDirty}
        >
          Set NFT Metadata
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
