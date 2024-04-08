import type { ThirdwebClient } from "../../client/client.js";
import { download } from "../../storage/download.js";
import type { PublishedMetadata } from "../actions/compiler-metadata.js";

type FetchSourceFilesFromMetadataOptions = {
  client: ThirdwebClient;
  publishedMetadata: PublishedMetadata;
};

type ContractSource = {
  filename: string;
  source: string;
};

/**
 * Fetches source files from metadata.
 *
 * @param options - The options for fetching source files.
 * @returns A promise that resolves to an array of ContractSource objects.
 * @internal
 */
export async function fetchSourceFilesFromMetadata(
  options: FetchSourceFilesFromMetadataOptions,
): Promise<ContractSource[]> {
  return Promise.all(
    Object.entries(options.publishedMetadata.metadata.sources).map(
      ([path, info]) => {
        // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
        const urls = (info as any).urls as string[];
        const ipfsLink = urls
          ? urls.find((url) => url.includes("ipfs"))
          : undefined;
        // return early if we can't find an ipfs link
        if (!ipfsLink) {
          return {
            filename: path,
            source:
              // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
              (info as any).content ||
              "Could not find source for this contract",
          };
        }
        const ipfsHash = ipfsLink.split("ipfs/")[1];
        return download({
          client: options.client,
          uri: `ipfs://${ipfsHash}`,
          // 3 sec timeout for sources that haven't been uploaded to ipfs
          requestTimeoutMs: 3000,
        })
          .then((res) => res.text())
          .then((source) => ({ filename: path, source }));
      },
    ),
  );
}
