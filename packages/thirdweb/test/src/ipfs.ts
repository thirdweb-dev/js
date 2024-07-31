/**
 * Pre-uploaded IPFS URIs to speed up some tests and avoid the IPFS timeout issues in Github Actions
 * Pinned on thirdweb Storage and some other nodes
 */

import type { DownloadOptions } from "src/storage/download.js";
import type { UploadOptions, UploadReturnType } from "src/storage/upload.js";
import type { UploadableFile } from "src/storage/upload/types.js";

export const getMockIpfsStorage = () => new Map<string, unknown>();

export const TEST_CONTRACT_URI =
  "ipfs://bafybeiewg2e3vehsb5pb34xwk25eyyfwlvajzmgz3rtdrvn3upsxnsbhzi/contractUri.json";
export const TEST_CONTRACT_DATA = {
  "name": "tw-contract-name",
  "symbol": "tw-contract-symbol",
  "description": "tw-contract-description"
};

export async function uploadMock<const TFiles extends UploadableFile[]>(
  options: UploadOptions<TFiles>,
  storageMock: Map<string, unknown>
): Promise<UploadReturnType<TFiles>> {
  const uris = [];
  for (const file in options.files) {
    const uri = `ipfs://${Math.random().toString(36).substring(2, 15)}/randomUri.json`;
    storageMock.set(uri, file);
    uris.push(uri);
  }
  if (uris.length === 0) {
    return null as UploadReturnType<TFiles>;
  }
  return (uris.length > 1 ? uris : uris[0]) as UploadReturnType<TFiles>;
}

export async function downloadMock(options: DownloadOptions, storageMock: Map<string, unknown>) {
  const result = (() => {
    if (storageMock.has(options.uri)) {
      return storageMock.get(options.uri);
    } else {
      return TEST_CONTRACT_DATA;
    }
  })();

  // mimic a network result
  return {
    json: () => result,
    text: () => result
  }
}

