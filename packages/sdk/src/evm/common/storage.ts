import { SDKOptions } from "../schema/sdk-options";
import { IThirdwebStorage, ThirdwebStorage } from "@thirdweb-dev/storage";

export function createStorage(
  storage?: IThirdwebStorage,
  options?: SDKOptions,
): IThirdwebStorage {
  if (storage) {
    return storage;
  } else if (options?.gatewayUrls) {
    return new ThirdwebStorage({
      gatewayUrls: options.gatewayUrls,
      clientId: options.clientId,
      secretKey: options.secretKey,
      authToken: options.authToken,
    });
  } else {
    return new ThirdwebStorage({
      clientId: options?.clientId,
      secretKey: options?.secretKey,
      authToken: options?.authToken,
    });
  }
}
