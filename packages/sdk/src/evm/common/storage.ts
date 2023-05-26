import { SDKOptions } from "../schema/sdk-options";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

export function createStorage(
  storage?: ThirdwebStorage,
  options?: SDKOptions,
): ThirdwebStorage {
  if (storage) {
    return storage;
  }
  return new ThirdwebStorage({
    gatewayUrls: options?.gatewayUrls,
    thirdwebApiKey: options?.thirdwebApiKey,
  })
}
