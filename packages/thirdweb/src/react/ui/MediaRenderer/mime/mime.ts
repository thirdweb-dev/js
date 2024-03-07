import { extensionsToMimeType } from "./types.js";

/**
 * Get mime type from a URL
 * @internal
 */
export function getMimeTypeFromUrl(url: string): string | null {
  const last = url.replace(/^.*[/\\]/, "").toLowerCase();
  const fileExtension = last.replace(/^.*\./, "").toLowerCase();

  const hasPath = last.length < url.length;
  const hasDot = fileExtension.length < last.length - 1;

  return ((hasDot || !hasPath) && extensionsToMimeType[fileExtension]) || null;
}
