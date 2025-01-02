import type { Abi } from "abitype";

/**
 * @contract
 */
export type CompilerMetadata = {
  name: string;
  abi: Abi;
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later by updating this type to match the specs here: https://docs.soliditylang.org/en/latest/metadata.html
  metadata: Record<string, any> & {
    sources: Record<string, { content: string } | { urls: string[] }>;
  };
  info: {
    title?: string;
    author?: string;
    details?: string;
    notice?: string;
  };
  licenses: string[];
  isPartialAbi?: boolean;
  zk_version?: string;
};

/**
 * Formats the compiler metadata into a standardized format.
 * @param metadata - The compiler metadata to be formatted.
 * @returns The formatted metadata.
 * @internal
 */
export function formatCompilerMetadata(
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
  metadata: any,
): CompilerMetadata {
  let meta = metadata;
  if ("source_metadata" in metadata) {
    meta = metadata.source_metadata;
  }
  const compilationTarget = meta.settings.compilationTarget;
  const targets = Object.keys(compilationTarget);
  const name = compilationTarget[targets[0] as keyof typeof compilationTarget];
  const info = {
    title: meta.output.devdoc.title,
    author: meta.output.devdoc.author,
    details: meta.output.devdoc.detail,
    notice: meta.output.userdoc.notice,
  };
  const licenses: string[] = [
    ...new Set(
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
      Object.entries(meta.sources).map(([, src]) => (src as any).license),
    ),
  ];
  return {
    name,
    abi: meta?.output?.abi || [],
    metadata: meta,
    info,
    licenses,
    isPartialAbi: meta.isPartialAbi,
    zk_version: metadata.zk_version,
  };
}
