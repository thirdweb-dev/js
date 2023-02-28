import { FileOrBufferOrString } from "../types";
import { DEFAULT_GATEWAY_URLS } from "./urls";
import { isBufferOrStringWithName } from "./utils";
import { importer } from "ipfs-unixfs-importer";

type CIDVersion = 0 | 1;

export async function getCID(
  data: FileOrBufferOrString[],
  wrapWithDirectory = true,
  cidVersion: CIDVersion = 0,
) {
  const options = { onlyHash: true, wrapWithDirectory, cidVersion };

  const content: Uint8Array[] = data.map((file) => {
    if (typeof file === "string") {
      return new TextEncoder().encode(file);
    } else if (isBufferOrStringWithName(file)) {
      if (typeof file.data === "string") {
        return new TextEncoder().encode(file.data);
      } else {
        return file.data as Uint8Array;
      }
    } else {
      return file as Uint8Array;
    }
  });
  const cleanedContent = content.map((c) => ({ content: c }));

  const dummyBlockstore = {
    put: async () => {},
  };

  let lastCid;
  for await (const { cid } of importer(
    cleanedContent as any,
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
