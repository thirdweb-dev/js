import {
  MockUploader,
  MockDownloader,
  ThirdwebStorage,
  FileOrBufferOrString,
} from "@thirdweb-dev/storage";

const storage = {};

export function MockStorage(): ThirdwebStorage {
  // Store mapping of URIs to files/objects
  const uploader = new MockUploader(storage);
  const downloader = new MockDownloader(storage);
  return new ThirdwebStorage({
    uploader,
    downloader,
    secretKey: process.env.TW_SECRET_KEY,
  });
}

export async function mockUploadWithCID(cid: any, file: FileOrBufferOrString) {
  const [cidMain, id] = cid.split("/");

  if (id) {
    storage[cidMain] = {
      [id]: file,
    };
  } else {
    storage[cid] = file;
  }
}
