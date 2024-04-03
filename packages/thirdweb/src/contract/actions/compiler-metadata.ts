import type { Abi } from "abitype";

export type PublishedMetadata = {
  name: string;
  abi: Abi;
  metadata: Record<string, any>;
  info: {
    title?: string;
    author?: string;
    details?: string;
    notice?: string;
  };
  licenses: string[];
  isPartialAbi?: boolean;
};

/**
 * Formats the compiler metadata into a standardized format.
 * @param metadata - The compiler metadata to be formatted.
 * @returns The formatted metadata.
 * @internal
 */
export function formatCompilerMetadata(metadata: any): PublishedMetadata {
  const compilationTarget = metadata.settings.compilationTarget;
  const targets = Object.keys(compilationTarget);
  const name = compilationTarget[targets[0] as keyof typeof compilationTarget];
  const info = {
    title: metadata.output.devdoc.title,
    author: metadata.output.devdoc.author,
    details: metadata.output.devdoc.detail,
    notice: metadata.output.userdoc.notice,
  };
  const licenses: string[] = [
    ...new Set(
      Object.entries(metadata.sources).map(([, src]) => (src as any).license),
    ),
  ];
  return {
    name,
    abi: metadata?.output?.abi || [],
    metadata,
    info,
    licenses,
    isPartialAbi: metadata.isPartialAbi,
  };
}
