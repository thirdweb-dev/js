import {
  DEFAULT_GATEWAY_URLS,
  FileOrBufferOrString,
  GatewayUrls,
  IpfsUploadBatchOptions,
  IpfsUploaderOptions,
  isBufferInstance,
  isFileInstance,
  IStorageDownloader,
  IStorageUploader,
  ThirdwebStorage,
} from "@thirdweb-dev/storage";
import { v4 as uuidv4 } from "uuid";

// Store mapping of URIs to files/objects
const ipfs: Record<string, any> = {};

class MockStorageUploader implements IStorageUploader<IpfsUploadBatchOptions> {
  async uploadBatch(
    data: FileOrBufferOrString[],
    options?: IpfsUploadBatchOptions | undefined,
  ): Promise<string[]> {
    const cid = uuidv4();
    const uris: string[] = [];
    ipfs[cid] = {};

    let index = options?.rewriteFileNames?.fileStartNumber || 0;
    for (const file of data) {
      let contents: string;
      if (isFileInstance(file)) {
        contents = await file.text();
      } else if (isBufferInstance(file)) {
        contents = file.toString();
      } else if (typeof file === "string") {
        contents = file;
      } else {
        contents = isBufferInstance(file.data)
          ? file.data.toString()
          : file.data;
        const name = file.name ? file.name : `file_${index}`;
        ipfs[cid][name] = contents;
        uris.push(`mock://${cid}/${name}`);
        continue;
      }

      ipfs[cid][index.toString()] = contents;
      uris.push(`mock://${cid}/${index}`);
      index += 1;
    }

    return uris;
  }
}

class MockStorageDownloader implements IStorageDownloader {
  gatewayUrls: GatewayUrls = DEFAULT_GATEWAY_URLS;

  async download(url: string): Promise<Response> {
    const [cid, name] = url.replace("mock://", "").split("/");
    const data = ipfs[cid][name];
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

export function MockStorage(): ThirdwebStorage {
  const uploader = new MockStorageUploader();
  const downloader = new MockStorageDownloader();
  return new ThirdwebStorage(uploader, downloader);
}
