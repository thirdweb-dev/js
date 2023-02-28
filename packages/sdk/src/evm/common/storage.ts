import { StorageConfigInput, StorageConfigSchema } from "../schema";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

function isStorage(config: StorageConfigInput): config is ThirdwebStorage {
  return config instanceof ThirdwebStorage;
}

export function createStorage(config: StorageConfigInput): ThirdwebStorage {
  const storage = StorageConfigSchema.parse(config);
  if (isStorage(config)) {
    return storage as ThirdwebStorage;
  } else {
    return new ThirdwebStorage({
      gatewayUrls: storage as Exclude<StorageConfigInput, ThirdwebStorage>,
    });
  }
}
