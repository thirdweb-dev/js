import { mediaMimeTypes } from "./types.js";

const extensionToMimetypeMap = new Map<string, string>();

function getFromMap(extension: string): string | undefined {
  // initialize the map
  if (extensionToMimetypeMap.size === 0) {
    for (const _type in mediaMimeTypes) {
      const type = _type as keyof typeof mediaMimeTypes;
      const extensions = mediaMimeTypes[type];
      for (let i = 0; i < extensions.length; i++) {
        extensions.forEach((e) => extensionToMimetypeMap.set(e, type));
      }
    }
  }

  return extensionToMimetypeMap.get(extension);
}

/**
 * Get mime type from a URL
 * @internal
 */
export function getMimeTypeFromUrl(url: string): string | null {
  const last = url.replace(/^.*[/\\]/, "").toLowerCase();
  const fileExtension = last.replace(/^.*\./, "").toLowerCase();

  const hasPath = last.length < url.length;
  const hasDot = fileExtension.length < last.length - 1;

  return ((hasDot || !hasPath) && getFromMap(fileExtension)) || null;
}
