import { DEFAULT_GATEWAY_URLS } from "../../common/urls";
import {
  GatewayUrls,
  IStorageDownloader,
  MemoryStorage,
} from "../../types/download";

/**
 * @internal
 */
export class MockDownloader implements IStorageDownloader {
  gatewayUrls: GatewayUrls = DEFAULT_GATEWAY_URLS;
  storage: MemoryStorage;

  constructor(storage: MemoryStorage) {
    this.storage = storage;
  }

  async download(url: string): Promise<Response> {
    const [cid, name] = url.includes("mock://")
      ? url.replace("mock://", "").split("/")
      : url.replace("ipfs://", "").split("/");
      // @ts-expect-error - TODO: should check index access
    const data = name ? this.storage[cid][name] : this.storage[cid];

    return {
      async json() {
        return Promise.resolve(JSON.parse(data));
      },
      async text() {
        return Promise.resolve(data);
      },
    } as Response;
  }
}
