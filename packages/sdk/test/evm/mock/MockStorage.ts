import {
  MockUploader,
  MockDownloader,
  ThirdwebStorage,
  FileOrBufferOrString,
} from "@thirdweb-dev/storage";

// Store mapping of URIs to files/objects
const storage = {};

export function MockStorage(): ThirdwebStorage {
  const uploader = new MockUploader(storage);
  const downloader = new MockDownloader(storage);
  return new ThirdwebStorage({ uploader, downloader });
}

export async function mockUploadWithCID(cid: any, file: FileOrBufferOrString) {
  storage[cid] = file;
}
