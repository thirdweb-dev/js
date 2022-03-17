import { PropertiesFormControl } from "../properties.shared";
import { IMintFormProps } from "./types";
import { useBundleDropMintMutation } from "@3rdweb-sdk/react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  Stack,
  Textarea,
  useModalContext,
  useToast,
} from "@chakra-ui/react";
import { EditionDrop } from "@thirdweb-dev/sdk";
import { OpenSeaPropertyBadge } from "components/badges/opensea";
import { Button } from "components/buttons/Button";
import { MismatchButton } from "components/buttons/MismatchButton";
import { FileInput } from "components/shared/FileInput";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import React from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { parseErrorToMessage } from "utils/errorParser";

const MINT_FORM_ID = "drop-mint-form";
interface IDropMintForm extends IMintFormProps {
  contract: EditionDrop;
}

export const BundleDropMintForm: React.FC<IDropMintForm> = ({ contract }) => {
  const mint = useBundleDropMintMutation(contract);
  const {
    setValue,
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(),
  });

  const imageUrl = useImageFileOrUrl(watch("image"));

  const modalContext = useModalContext();
  const toast = useToast();

  const onSuccess = () => {
    toast({
      title: "Success",
      description: "Bundledrop created successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    modalContext.onClose();
  };

  const onError = (error: unknown) => {
    toast({
      title: "Error",
      description: parseErrorToMessage(error),
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  // TODO FIXME
  const onSubmit = (data: any) => {
    mint.mutate(data, { onSuccess, onError });
  };

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
      file.name.endsWith(".glb")
    ) {
      // audio, video, html, and glb (3d) files
      setValue("animation_url", file);
      if (watch("external_url") instanceof File) {
        setValue("external_url", undefined);
      }
    } else if (
      ["text", "application/pdf"].some((type: string) =>
        file.type.includes(type),
      )
    ) {
      // text and pdf files
      setValue("external_url", file);
      if (watch("animation_url") instanceof File) {
        setValue("animation_url", undefined);
      }
    }
  };

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

  return (
    <>
      <DrawerBody>
        <Stack
          spacing={6}
          as="form"
          id={MINT_FORM_ID}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack>
            <Heading size="subtitle.md">Metadata</Heading>
            <Divider />
          </Stack>
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input autoFocus {...register("name")} />
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
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
            <FormErrorMessage>{mediaFileError?.message}</FormErrorMessage>
          </FormControl>
          {showCoverImageUpload && (
            <FormControl isInvalid={!!errors.image}>
              <FormLabel>Cover Image</FormLabel>
              <FileInput
                maxContainerWidth={"200px"}
                accept="image/*"
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
              <FormErrorMessage>{errors?.image?.message}</FormErrorMessage>
            </FormControl>
          )}

          <FormControl isInvalid={!!errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea {...register("description")} />
            <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
          </FormControl>
          <PropertiesFormControl
            watch={watch}
            errors={errors}
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
                <Heading size="subtitle.md">Advanced Metadata</Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={0} as={Stack} spacing={6}>
                <FormControl isInvalid={!!errors.background_color}>
                  <FormLabel>
                    Background Color <OpenSeaPropertyBadge />
                  </FormLabel>
                  <Input max="6" {...register("background_color")} />
                  <FormHelperText>
                    Must be a six-character hexadecimal without a pre-pended #.
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
                      {errors?.external_url?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <Button
          isDisabled={mint.isLoading}
          variant="outline"
          mr={3}
          onClick={modalContext.onClose}
        >
          Cancel
        </Button>
        <MismatchButton
          isLoading={mint.isLoading}
          leftIcon={<Icon as={FiPlus} />}
          form={MINT_FORM_ID}
          type="submit"
          colorScheme="primary"
        >
          Create Edition Drop
        </MismatchButton>
      </DrawerFooter>
    </>
  );
};
