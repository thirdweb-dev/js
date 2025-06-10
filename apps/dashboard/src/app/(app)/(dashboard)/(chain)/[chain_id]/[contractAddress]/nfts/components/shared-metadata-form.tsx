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
import { TransactionButton } from "components/buttons/TransactionButton";
import { FileInput } from "components/shared/FileInput";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
  getUploadedNFTMediaMeta,
  handleNFTMediaUpload,
} from "../../modules/components/nft/handleNFTMediaUpload";

const SHARED_METADATA_FORM_ID = "shared-metadata-form";

export const SharedMetadataForm: React.FC<{
  contract: ThirdwebContract;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
}> = ({ contract, setOpen, isLoggedIn }) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const form = useForm<NFTMetadataInputLimited>();
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const setFile = (file: File) => {
    handleNFTMediaUpload({ file, form });
  };

  const { media, image, mediaFileError, showCoverImageUpload, animation_url } =
    getUploadedNFTMediaMeta(form);

  const setSharedMetaNotifications = useTxNotifications(
    "Shared metadata updated successfully",
    "Failed to update shared metadata",
  );

  return (
    <>
      <form
        className="mt-6 flex flex-col gap-6"
        id={SHARED_METADATA_FORM_ID}
        onSubmit={handleSubmit(async (data) => {
          if (!address) {
            toast.error("Please connect your wallet.");
            return;
          }

          const dataWithCustom = {
            ...data,
            image: data.image,
            animation_url: data.animation_url,
          };

          trackEvent({
            category: "nft",
            action: "set-shared-metadata",
            label: "attempt",
          });
          try {
            const transaction = setSharedMetadata({
              contract,
              nft: parseAttributes(dataWithCustom),
            });
            await sendAndConfirmTx.mutateAsync(transaction, {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "set-shared-metadata",
                  label: "success",
                });
                setOpen(false);
              },
              // biome-ignore lint/suspicious/noExplicitAny: FIXME
              onError: (error: any) => {
                trackEvent({
                  category: "nft",
                  action: "set-shared-metadata",
                  label: "error",
                  error,
                });
              },
            });

            setSharedMetaNotifications.onSuccess();
          } catch (err) {
            console.error(err);
            setSharedMetaNotifications.onError(err);
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
              value={media}
              client={contract.client}
              showUploadButton
              showPreview={true}
              setValue={setFile}
              className="shrink-0 rounded border border-border transition-all duration-200"
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
              client={contract.client}
              previewMaxWidth="200px"
              accept={{ "image/*": [] }}
              value={image}
              showUploadButton
              setValue={(file) => setValue("image", file)}
              className="shrink-0 rounded border border-border transition-all"
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
            <AccordionPanel className="!px-0 flex flex-col gap-6">
              {!(image instanceof File) && (
                <FormControl isInvalid={!!errors.image}>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    value={image}
                    onChange={(e) => {
                      setValue("image", e.target.value);
                    }}
                  />
                  <FormHelperText>
                    If you already have your NFT image pre-uploaded, you can set
                    the URL or URI here.
                  </FormHelperText>
                  <FormErrorMessage>{errors?.image?.message}</FormErrorMessage>
                </FormControl>
              )}

              {!(animation_url instanceof File) && (
                <FormControl isInvalid={!!errors.animation_url}>
                  <FormLabel>Animation URL</FormLabel>
                  <Input
                    value={animation_url}
                    onChange={(e) => {
                      setValue("animation_url", e.target.value);
                    }}
                  />
                  <FormHelperText>
                    If you already have your NFT Animation URL pre-uploaded, you
                    can set the URL or URI here.
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
          variant="outline"
          mr={3}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <TransactionButton
          client={contract.client}
          txChainID={contract.chain.id}
          transactionCount={1}
          isPending={sendAndConfirmTx.isPending}
          form={SHARED_METADATA_FORM_ID}
          type="submit"
          disabled={!isDirty}
          isLoggedIn={isLoggedIn}
        >
          Set NFT Metadata
        </TransactionButton>
      </div>
    </>
  );
};
