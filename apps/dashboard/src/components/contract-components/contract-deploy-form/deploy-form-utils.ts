import { StorageSingleton } from "lib/sdk";

// biome-ignore lint/suspicious/noExplicitAny: FIXME
export async function uploadContractMetadata(metadata: any) {
  const uri = await StorageSingleton.upload(metadata);
  return uri;
}
