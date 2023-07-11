import { SDKOptions } from "../schema/sdk-options";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

export function createStorage(
  storage?: ThirdwebStorage,
  options?: SDKOptions,
): ThirdwebStorage {
  if (storage) {
    return storage;
  } else if (options?.gatewayUrls) {
    return new ThirdwebStorage({
      gatewayUrls: options.gatewayUrls,
      thirdwebApiKey: options.thirdwebApiKey,
    });
  } else {
    return new ThirdwebStorage({
      thirdwebApiKey: options?.thirdwebApiKey,
    });
  }
}
