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
  Stack,
  Textarea,
  useModalContext,
} from "@chakra-ui/react";
import { UseMutationResult } from "@tanstack/react-query";
import {
  NFTContract,
  useAddress,
  useMintNFT,
  useSetSharedMetadata,
} from "@thirdweb-dev/react";
import type { NFTMetadataInput } from "@thirdweb-dev/sdk";
import { OpenSeaPropertyBadge } from "components/badges/opensea";
import { TransactionButton } from "components/buttons/TransactionButton";
import { detectFeatures } from "components/contract-components/utils";
import { PropertiesFormControl } from "components/contract-pages/forms/properties.shared";
import { FileInput } from "components/shared/FileInput";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import {
  Button,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
} from "tw-components";
import { NFTMetadataInputLimited } from "types/modified-types";
import { parseAttributes } from "utils/parseAttributes";

const MINT_FORM_ID = "nft-mint-form";

type NFTMintForm =
  | {
      contract?: NFTContract;
      mintMutation: ReturnType<typeof useMintNFT>;

      lazyMintMutation?: undefined;
      sharedMetadataMutation?: undefined;
    }
  | {
      contract?: NFTContract;
      lazyMintMutation: UseMutationResult<
        unknown,
        unknown,
        { metadatas: NFTMetadataInput[] }
      >;
      mintMutation?: undefined;
      sharedMetadataMutation?: undefined;
    }
  | {
      contract?: NFTContract;
      sharedMetadataMutation: ReturnType<typeof useSetSharedMetadata>;
      mintMutation?: undefined;
      lazyMintMutation?: undefined;
    };

export const NFTMintForm: React.FC<NFTMintForm> = ({
  contract,
  lazyMintMutation,
  mintMutation,
  sharedMetadataMutation,
}) => {
  const trackEvent = useTrack();
  const address = useAddress();

  const mutation = mintMutation || lazyMintMutation || sharedMetadataMutation;

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

  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    sharedMetadataMutation
      ? "NFT Metadata set successfully"
      : "NFT minted successfully",
    sharedMetadataMutation
      ? "Failed to set NFT Metadata"
      : "Failed to mint NFT",
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
      file.name?.endsWith(".gltf")
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

  const imageUrl = useImageFileOrUrl(watch("image"));
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

  const isErc1155 = detectFeatures(contract, ["ERC1155"]);

  return (
    <>
      <DrawerHeader>
        <Heading>
          {sharedMetadataMutation ? "Set NFT Metadata" : "Mint NFT"}
        </Heading>
      </DrawerHeader>
      <DrawerBody>
        <Stack
          spacing={6}
          as="form"
          id={MINT_FORM_ID}
          onSubmit={handleSubmit((data) => {
            if (!address) {
              onError("Please connect your wallet to mint.");
              return;
            }

            const dataWithCustom = {
              ...data,
              ...(data.customImage && {
                image: data.customImage,
              }),
              ...(data.customAnimationUrl && {
                animation_url: data.customAnimationUrl,
              }),
            };

            if (lazyMintMutation) {
              trackEvent({
                category: "nft",
                action: "lazy-mint",
                label: "attempt",
              });
              lazyMintMutation.mutate(
                {
                  metadatas: [parseAttributes(dataWithCustom)],
                },
                {
                  onSuccess: () => {
                    trackEvent({
                      category: "nft",
                      action: "lazy-mint",
                      label: "success",
                    });
                    onSuccess();
                    modalContext.onClose();
                  },
                  onError: (error) => {
                    trackEvent({
                      category: "nft",
                      action: "lazy-mint",
                      label: "error",
                      error,
                    });
                    onError(error);
                  },
                },
              );
            }

            if (mintMutation) {
              trackEvent({
                category: "nft",
                action: "mint",
                label: "attempt",
              });
              mintMutation.mutate(
                {
                  to: address,
                  metadata: parseAttributes(dataWithCustom),
                  supply: data.supply,
                },
                {
                  onSuccess: () => {
                    trackEvent({
                      category: "nft",
                      action: "mint",
                      label: "success",
                    });
                    onSuccess();
                    modalContext.onClose();
                  },
                  onError: (error: any) => {
                    trackEvent({
                      category: "nft",
                      action: "mint",
                      label: "error",
                      error,
                    });
                    onError(error);
                  },
                },
              );
            }

            if (sharedMetadataMutation) {
              trackEvent({
                category: "nft",
                action: "set-shared-metadata",
                label: "attempt",
              });
              sharedMetadataMutation.mutate(parseAttributes(dataWithCustom), {
                onSuccess: () => {
                  trackEvent({
                    category: "nft",
                    action: "set-shared-metadata",
                    label: "success",
                  });
                  onSuccess();
                  modalContext.onClose();
                },
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
            }
          })}
        >
          <Stack>
            <Heading size="subtitle.md">Metadata</Heading>
            <Divider />
          </Stack>
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input autoFocus {...register("name")} />
            <FormErrorMessage>
              <>{errors?.name?.message}</>
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!mediaFileError}>
            <FormLabel>Media</FormLabel>
            <FileInput
              maxContainerWidth={"200px"}
              value={mediaFileUrl}
              showUploadButton
              setValue={setFile}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              transition="all 200ms ease"
              _hover={{ shadow: "sm" }}
            />
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
                maxContainerWidth={"200px"}
                accept={{ "image/*": [] }}
                value={imageUrl}
                showUploadButton
                setValue={(file) => setValue("image", file)}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                transition="all 200ms ease"
                _hover={{ shadow: "sm" }}
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
            <FormErrorMessage>
              <>{errors?.description?.message}</>
            </FormErrorMessage>
          </FormControl>
          {!sharedMetadataMutation && (
            <>
              {isErc1155 && mintMutation && (
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
                errors={errors as any}
                control={control}
                register={register}
                setValue={setValue}
              />
            </>
          )}
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
              <AccordionPanel px={0} as={Stack} spacing={6}>
                {!sharedMetadataMutation && (
                  <>
                    <FormControl isInvalid={!!errors.background_color}>
                      <FormLabel>
                        Background Color <OpenSeaPropertyBadge />
                      </FormLabel>
                      <Input max="6" {...register("background_color")} />
                      <FormHelperText>
                        Must be a six-character hexadecimal with a pre-pended #.
                      </FormHelperText>
                      <FormErrorMessage>
                        <>{errors?.background_color?.message}</>
                      </FormErrorMessage>
                    </FormControl>
                    {!externalIsTextFile && (
                      <FormControl isInvalid={!!errors.external_url}>
                        <FormLabel>
                          External URL <OpenSeaPropertyBadge />
                        </FormLabel>
                        <Input {...register("external_url")} />
                        <FormHelperText>
                          This is the URL that will appear below the
                          asset&apos;s image on OpenSea and will allow users to
                          leave OpenSea and view the item on your site.
                        </FormHelperText>
                        <FormErrorMessage>
                          {errors?.external_url?.message as unknown as string}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </>
                )}
                <FormControl isInvalid={!!errors.customImage}>
                  <FormLabel>Image URL</FormLabel>
                  <Input max="6" {...register("customImage")} />
                  <FormHelperText>
                    If you already have your NFT image preuploaded, you can set
                    the URL or URI here.
                  </FormHelperText>
                  <FormErrorMessage>
                    <>{errors?.customImage?.message}</>
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
                    <>{errors?.customAnimationUrl?.message}</>
                  </FormErrorMessage>
                </FormControl>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <Button
          isDisabled={mutation?.isLoading}
          variant="outline"
          mr={3}
          onClick={modalContext.onClose}
        >
          Cancel
        </Button>
        <TransactionButton
          transactionCount={1}
          isLoading={mutation?.isLoading || false}
          form={MINT_FORM_ID}
          type="submit"
          colorScheme="primary"
          isDisabled={!isDirty}
        >
          {sharedMetadataMutation
            ? "Set NFT Metadata"
            : lazyMintMutation
              ? "Lazy Mint NFT"
              : "Mint NFT"}
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
