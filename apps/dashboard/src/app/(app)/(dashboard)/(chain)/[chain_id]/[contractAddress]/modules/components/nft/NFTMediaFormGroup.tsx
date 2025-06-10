"use client";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { FileInput } from "components/shared/FileInput";
import type { UseFormReturn } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import type { NFTInput } from "thirdweb/utils";
import {
  getUploadedNFTMediaMeta,
  handleNFTMediaUpload,
} from "./handleNFTMediaUpload";

type NFTMediaFormGroupValues = {
  image?: NFTInput["image"];
  animation_url?: NFTInput["animation_url"];
  external_url?: NFTInput["external_url"];
};

export function NFTMediaFormGroup<T extends NFTMediaFormGroupValues>(props: {
  form: UseFormReturn<T>;
  previewMaxWidth?: string;
  client: ThirdwebClient;
}) {
  // T contains all properties of NFTMediaFormGroupValues, so this is a-ok
  const form = props.form as unknown as UseFormReturn<NFTMediaFormGroupValues>;

  const { media, image, mediaFileError, showCoverImageUpload } =
    getUploadedNFTMediaMeta(form);

  const previewMaxWidth = props.previewMaxWidth ?? "200px";

  const setFile = (file: File) => {
    handleNFTMediaUpload({ file, form });
  };

  return (
    <div className="flex flex-col gap-6">
      <FormFieldSetup
        errorMessage={mediaFileError?.message}
        htmlFor="media"
        label="Media"
        isRequired={false}
      >
        <p className="mb-2 text-muted-foreground text-sm">
          You can upload image, audio, video, html, text, pdf, or 3d model file
        </p>
        <FileInput
          previewMaxWidth={previewMaxWidth}
          value={media}
          showPreview={true}
          setValue={setFile}
          className="max-sm:!max-w-full rounded border border-border transition-all duration-200"
          selectOrUpload="Upload"
          client={props.client}
          helperText="Media"
        />
      </FormFieldSetup>

      {showCoverImageUpload && (
        <FormFieldSetup
          errorMessage={form.formState.errors?.image?.message}
          htmlFor="cover-image"
          label="Cover Image"
          tooltip="You can optionally upload an image as the cover of your NFT."
          isRequired={false}
        >
          <FileInput
            previewMaxWidth={previewMaxWidth}
            client={props.client}
            accept={{ "image/*": [] }}
            value={image}
            showUploadButton
            setValue={(file) => {
              form.setValue("image", file);
            }}
            className="rounded border border-border transition-all"
          />
        </FormFieldSetup>
      )}
    </div>
  );
}
