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
    const [cid, name] = url.replace("mock://", "").split("/");
    const data = this.storage[cid][name];
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
