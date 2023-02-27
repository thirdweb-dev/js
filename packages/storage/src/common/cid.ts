import { importer } from "ipfs-unixfs-importer";

type CIDVersion = 0 | 1;

export async function getCID(
  data: string | Uint8Array,
  cidVersion: CIDVersion = 0,
) {
  const options = { onlyHash: true, cidVersion };

  let content: Uint8Array;
  if (typeof data === "string") {
    content = new TextEncoder().encode(data as string);
  } else {
    content = data;
  }

  const dummyBlockstore = {
    put: async () => {},
  };

  let lastCid;
  for await (const { cid } of importer(
    [{ content }] as any,
    dummyBlockstore as any,
    options,
  )) {
    lastCid = cid;
  }

  return `${lastCid}`;
}
