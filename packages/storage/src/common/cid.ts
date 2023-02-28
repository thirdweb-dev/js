import { FileOrBufferOrString } from "../types";
import { DEFAULT_GATEWAY_URLS } from "./urls";
import { isBufferOrStringWithName } from "./utils";
import fetch from "cross-fetch";
import { importer } from "ipfs-unixfs-importer";

type CIDVersion = 0 | 1;
type ContentWithPath = {
  path?: string;
  content: Uint8Array;
};

export async function getCIDForUpload(
  data: FileOrBufferOrString[],
  fileNames: string[],
  wrapWithDirectory = true,
  cidVersion: CIDVersion = 0,
) {
  const contentWithPath: ContentWithPath[] = data.map((file, i) => {
    const path = fileNames[i];

    let content: Uint8Array;
    if (typeof file === "string") {
      content = new TextEncoder().encode(file);
    } else if (isBufferOrStringWithName(file)) {
      if (typeof file.data === "string") {
        content = new TextEncoder().encode(file.data);
      } else {
        content = file.data as Uint8Array;
      }
    } else {
      content = file as Uint8Array;
    }

    return { path, content };
  });

  return getCID(contentWithPath, wrapWithDirectory, cidVersion);
}

export async function getCID(
  content: ContentWithPath[],
  wrapWithDirectory = true,
  cidVersion: CIDVersion = 0,
) {
  const options = { onlyHash: true, wrapWithDirectory, cidVersion };

  const dummyBlockstore = {
    put: async () => {},
  };

  let lastCid;
  for await (const { cid } of importer(
    content as any,
    dummyBlockstore as any,
    options,
  )) {
    lastCid = cid;
  }

  return `${lastCid}`;
}

export async function isUploaded(cid: string) {
  const res = await fetch(`${DEFAULT_GATEWAY_URLS["ipfs://"][0]}${cid}`, {
    method: "HEAD",
  });
  return res.ok;
}
