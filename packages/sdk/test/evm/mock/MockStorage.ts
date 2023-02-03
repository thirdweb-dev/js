import {
  MockUploader,
  MockDownloader,
  ThirdwebStorage,
  IpfsUploadBatchOptions,
  FileOrBufferOrString,
} from "@thirdweb-dev/storage";

const storage = {};

export function MockStorage(): ThirdwebStorage {
  // Store mapping of URIs to files/objects
  const uploader = new MockUploader(storage);
  const downloader = new MockDownloader(storage);
  return new ThirdwebStorage({ uploader, downloader });
}

export async function mockUploadWithCID(
  cid: any,
  file: FileOrBufferOrString,
  options?: IpfsUploadBatchOptions | undefined,
) {
  storage[cid] = file;
}
