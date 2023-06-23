import {FileOrBufferOrString} from "../types";
import {DEFAULT_GATEWAY_URLS, getUrlForCid} from "./urls";
import {isBufferOrStringWithName} from "./utils";
import fetch from "cross-fetch";
import {importer} from "ipfs-unixfs-importer";
import {CID} from "multiformats/cid";

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
  const contentWithPath: ContentWithPath[] = await Promise.all(
    data.map(async (file, i) => {
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
      } else if (Buffer.isBuffer(file)) {
        content = file as Uint8Array;
      } else {
        const buffer = await file.arrayBuffer();
        content = new Uint8Array(buffer);
      }

      return { path, content };
    }),
  );

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
    lastCid = cid.toV1().toString();
  }

  return lastCid;
}

export async function isUploaded(cid: string) {
  const url = getUrlForCid(DEFAULT_GATEWAY_URLS["ipfs://"][0], cid)
  const res = await fetch(`${url}${cid}`, {
    method: "HEAD",
    headers: {
      // tell the gateway to skip fetching from origin in order to fail fast on 404s and just re-upload in those cases
      "x-skip-origin": "true",
    },
  });
  return res.ok;
}

export function normalizeCID(cid: string) {
  let normalized: string
  try {
    normalized = CID.parse(cid).toV1().toString();
  }
  catch (e) {
    throw new Error(`The CID ${cid} is not valid.`)
  }
  return normalized
}