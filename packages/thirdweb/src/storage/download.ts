import type { RawClient } from "../client/client.js";

export type DownloadOptions = {
  uri: string;
};

export async function download(client: RawClient, options: DownloadOptions) {
  let url: string;
  if (options.uri.startsWith("ipfs://")) {
    url = `https://${client.clientId}.ipfscdn.io/ipfs/${options.uri.slice(7)}`;
  } else if (options.uri.startsWith("http")) {
    url = options.uri;
  } else {
    throw new Error(`Invalid URI scheme, expected "ipfs://" or "http(s)://"`);
  }
  return await fetch(url);
}
