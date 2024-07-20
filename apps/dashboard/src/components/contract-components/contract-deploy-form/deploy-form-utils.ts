import { thirdwebClient } from "@/constants/client";
import { upload } from "thirdweb/storage";

// biome-ignore lint/suspicious/noExplicitAny: FIXME
export async function uploadContractMetadata(metadata: any) {
  const uri = await upload({ client: thirdwebClient, files: [metadata] });
  return uri;
}
