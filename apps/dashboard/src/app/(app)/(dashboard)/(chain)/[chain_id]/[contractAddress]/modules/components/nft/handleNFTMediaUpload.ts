import type { UseFormReturn } from "react-hook-form";
import type { NFTInput } from "thirdweb/utils";

type MinimalNFTMetadata = {
  image?: NFTInput["image"];
  animation_url?: NFTInput["animation_url"];
  external_url?: NFTInput["external_url"];
};

export function handleNFTMediaUpload<T extends MinimalNFTMetadata>(params: {
  file: File;
  form: UseFormReturn<T>;
}) {
  const { file } = params;
  const form = params.form as unknown as UseFormReturn<MinimalNFTMetadata>;

  const external_url = form.getValues("external_url");
  const animation_url = form.getValues("animation_url");

  if (file.type.includes("image")) {
    form.setValue("image", file);

    if (external_url instanceof File) {
      form.setValue("external_url", undefined);
    }

    if (animation_url instanceof File) {
      form.setValue("animation_url", undefined);
    }
  } else if (
    ["audio", "video", "text/html", "model/"].some((type: string) =>
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
}

export function getUploadedNFTMediaMeta<T extends MinimalNFTMetadata>(
  _form: UseFormReturn<T>,
) {
  const form = _form as unknown as UseFormReturn<MinimalNFTMetadata>;

  const _animation_url = form.watch("animation_url");
  const _external_url = form.watch("external_url");
  const _image = form.watch("image");
  const _media = _animation_url || _external_url || _image;
  const errors = form.formState.errors;

  return {
    animation_url: stringOrFile(_animation_url),
    external_url: stringOrFile(_external_url),
    image: stringOrFile(_image),
    media: stringOrFile(_media),
    mediaFileError:
      errors?.animation_url || errors.external_url || errors?.image,
    showCoverImageUpload: !!_animation_url || !!_external_url,
  };
}

function stringOrFile(value: unknown): string | File | undefined {
  if (typeof value === "string" || value instanceof File) {
    return value;
  }

  return undefined;
}
