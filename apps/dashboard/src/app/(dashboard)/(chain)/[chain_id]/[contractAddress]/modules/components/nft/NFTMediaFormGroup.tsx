"use client";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { FileInput } from "components/shared/FileInput";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import type { UseFormReturn } from "react-hook-form";
import type { NFTInput } from "thirdweb/utils";

type NFTMediaFormGroupValues = {
  image?: NFTInput["image"];
  animation_url?: NFTInput["animation_url"];
  external_url?: NFTInput["external_url"];
};
export function NFTMediaFormGroup<T extends NFTMediaFormGroupValues>(props: {
  form: UseFormReturn<T>;
  previewMaxWidth?: string;
}) {
  // T contains all properties of NFTMediaFormGroupValues, so this is a-ok
  const form = props.form as unknown as UseFormReturn<NFTMediaFormGroupValues>;

  const setFile = (file: File) => {
    const external_url = form.watch("external_url");
    const animation_url = form.watch("animation_url");

    if (file.type.includes("image")) {
      form.setValue("image", file);
      if (external_url instanceof File) {
        form.setValue("external_url", undefined);
      }
      if (animation_url instanceof File) {
        form.setValue("animation_url", undefined);
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
      form.setValue("animation_url", file);
      if (external_url instanceof File) {
        form.setValue("external_url", undefined);
      }
    } else if (
      ["text", "application/pdf"].some((type: string) =>
        file.type?.includes(type),
      )
    ) {
      // text and pdf files
      form.setValue("external_url", file);
      if (animation_url instanceof File) {
        form.setValue("animation_url", undefined);
      }
    }
  };

  const external_url = form.watch("external_url");
  const animation_url = form.watch("animation_url");
  const image = form.watch("image");
  const errors = form.formState.errors;

  const imageUrl = useImageFileOrUrl(image as File | string);
  const showCoverImageUpload =
    animation_url instanceof File || external_url instanceof File;

  const mediaFileUrl =
    animation_url instanceof File
      ? animation_url
      : external_url instanceof File
        ? external_url
        : image instanceof File
          ? imageUrl
          : undefined;

  const mediaFileError =
    animation_url instanceof File
      ? errors?.animation_url
      : external_url instanceof File
        ? errors?.external_url
        : image instanceof File
          ? errors?.image
          : undefined;

  const previewMaxWidth = props.previewMaxWidth ?? "200px";
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
          value={mediaFileUrl as File | string}
          showPreview={true}
          setValue={setFile}
          className="max-sm:!max-w-full rounded border border-border transition-all duration-200"
          selectOrUpload="Upload"
          helperText="Media"
        />
      </FormFieldSetup>

      {showCoverImageUpload && (
        <FormFieldSetup
          errorMessage={form.formState.errors?.image?.message}
          htmlFor="cover-image"
          label="Cover Image"
          tooltip="You can optionally upload an image as the cover of your NFT."
          isRequired
        >
          <FileInput
            previewMaxWidth={previewMaxWidth}
            accept={{ "image/*": [] }}
            value={imageUrl}
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
