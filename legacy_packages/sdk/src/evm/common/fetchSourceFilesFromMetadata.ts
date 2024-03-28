import { PublishedMetadata, ContractSource } from "../schema/contracts/custom";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";

/**
 * @internal
 * @param publishedMetadata - The published metadata to fetch the sources for
 * @param storage - The storage to use
 */

export async function fetchSourceFilesFromMetadata(
  publishedMetadata: PublishedMetadata,
  storage: ThirdwebStorage,
): Promise<ContractSource[]> {
  return await Promise.all(
    Object.entries(publishedMetadata.metadata.sources).map(
      async ([path, info]) => {
        const urls = (info as any).urls as string[];
        const ipfsLink = urls
          ? urls.find((url) => url.includes("ipfs"))
          : undefined;
        if (ipfsLink) {
          const ipfsHash = ipfsLink.split("ipfs/")[1];
          // 3 sec timeout for sources that haven't been uploaded to ipfs
          const timeout = new Promise<string>((_r, rej) =>
            setTimeout(() => rej("timeout"), 3000),
          );
          const source = await Promise.race([
            (await storage.download(`ipfs://${ipfsHash}`)).text(),
            timeout,
          ]);
          return {
            filename: path,
            source,
          };
        } else {
          return {
            filename: path,
            source:
              (info as any).content ||
              "Could not find source for this contract",
          };
        }
      },
    ),
  );
}
