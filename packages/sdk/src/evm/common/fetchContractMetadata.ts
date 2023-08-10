import {
  PublishedMetadata,
  AbiSchema,
  ContractInfoSchema,
} from "../schema/contracts/custom";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";

/**
 * @internal
 * @param compilerMetadataUri
 * @param storage
 */

export async function fetchContractMetadata(
  compilerMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<PublishedMetadata> {
  const metadata = await storage.downloadJSON(compilerMetadataUri);
  if (!metadata || !metadata.output) {
    throw new Error(
      `Could not resolve metadata for contract at ${compilerMetadataUri}`,
    );
  }
  const abi = AbiSchema.parse(metadata.output.abi);
  const compilationTarget = metadata.settings.compilationTarget;
  const targets = Object.keys(compilationTarget);
  const name = compilationTarget[targets[0]];
  const info = ContractInfoSchema.parse({
    title: metadata.output.devdoc.title,
    author: metadata.output.devdoc.author,
    details: metadata.output.devdoc.detail,
    notice: metadata.output.userdoc.notice,
  });
  const licenses: string[] = [
    ...new Set(
      Object.entries(metadata.sources).map(([, src]) => (src as any).license),
    ),
  ];
  return {
    name,
    abi,
    metadata,
    info,
    licenses,
  };
}
