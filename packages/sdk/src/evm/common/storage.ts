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
      clientId: options.thirdwebApiKey,
    });
  } else {
    return new ThirdwebStorage({
      clientId: options?.thirdwebApiKey,
    });
  }
}
