export function handleArbitraryTokenURI(rawUri: string): string {
  if (rawUri.startsWith("ipfs://")) {
    return rawUri;
  }
  if (!rawUri.includes("ipfs")) {
    return rawUri;
  }
  return `ipfs://${rawUri.split("/ipfs/").at(-1)}`;
}

export function shouldDownloadURI(rawUri: string): boolean {
  return handleArbitraryTokenURI(rawUri).startsWith("ipfs://");
}
