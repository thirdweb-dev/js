import { useMemo } from "react";
import { isBrowser } from "utils/isBrowser";

export function useImageFileOrUrl(image?: string | File): string {
  return useMemo(() => {
    if (!image) {
      return "";
    }
    return typeof image === "string"
      ? image
      : isBrowser()
        ? URL.createObjectURL(image)
        : "";
  }, [image]);
}
