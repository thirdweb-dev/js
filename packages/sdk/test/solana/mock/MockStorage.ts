import {
  MockUploader,
  MockDownloader,
  ThirdwebStorage,
} from "@thirdweb-dev/storage";

export function MockStorage(): ThirdwebStorage {
  // Store mapping of URIs to files/objects
  const storage = {};

  const uploader = new MockUploader(storage);
  const downloader = new MockDownloader(storage);
  return new ThirdwebStorage({
    uploader,
    downloader,
    secretKey: process.env.TW_SECRET_KEY,
  });
}
