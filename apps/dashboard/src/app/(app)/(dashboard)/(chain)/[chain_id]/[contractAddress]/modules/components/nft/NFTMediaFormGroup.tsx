"use client";
import { FileInput } from "components/shared/FileInput";
import type { UseFormReturn } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import type { NFTInput } from "thirdweb/utils";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
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
        isRequired={false}
        label="Media"
      >
        <p className="mb-2 text-muted-foreground text-sm">
          You can upload image, audio, video, html, text, pdf, or 3d model file
        </p>
        <FileInput
          className="max-sm:!max-w-full rounded border border-border transition-all duration-200"
          client={props.client}
          helperText="Media"
          previewMaxWidth={previewMaxWidth}
          selectOrUpload="Upload"
          setValue={setFile}
          showPreview={true}
          value={media}
        />
      </FormFieldSetup>

      {showCoverImageUpload && (
        <FormFieldSetup
          errorMessage={form.formState.errors?.image?.message}
          htmlFor="cover-image"
          isRequired={false}
          label="Cover Image"
          tooltip="You can optionally upload an image as the cover of your NFT."
        >
          <FileInput
            accept={{ "image/*": [] }}
            className="rounded border border-border transition-all"
            client={props.client}
            previewMaxWidth={previewMaxWidth}
            setValue={(file) => {
              form.setValue("image", file);
            }}
            showUploadButton
            value={image}
          />
        </FormFieldSetup>
      )}
    </div>
  );
}
