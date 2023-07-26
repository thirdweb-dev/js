import {
  NetworkInput,
  SDKOptions,
  ThirdwebSDK as ThirdwebSDKCore,
} from "@thirdweb-dev/react-core";
import { IThirdwebStorage } from "@thirdweb-dev/storage";
import { ThirdwebStorage } from "../../core/storage/storage";

export class ThirdwebSDK extends ThirdwebSDKCore {
  constructor(
    network: NetworkInput,
    options: SDKOptions = {},
    storage?: IThirdwebStorage,
  ) {
    super(
      network,
      options,
      storage ||
        new ThirdwebStorage({
          clientId: options.clientId,
          gatewayUrls: options.gatewayUrls,
        }),
    );
  }
}
