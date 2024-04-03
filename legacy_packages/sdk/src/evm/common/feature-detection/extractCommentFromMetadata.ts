/**
 * @internal
 * @param name - The name of the function to extract the comment from
 * @param metadata - The metadata to extract the comment from
 * @param type - The type of the function to extract the comment from
 */
export function extractCommentFromMetadata(
  name: string | undefined,
  metadata: Record<string, any> | undefined,
  type: "methods" | "events",
) {
  return (
    metadata?.output?.userdoc?.[type]?.[
      Object.keys(metadata?.output?.userdoc[type] || {}).find((fn) =>
        fn.includes(name || "unknown"),
      ) || ""
    ]?.notice ||
    metadata?.output?.devdoc?.[type]?.[
      Object.keys(metadata?.output?.devdoc[type] || {}).find((fn) =>
        fn.includes(name || "unknown"),
      ) || ""
    ]?.details
  );
}
