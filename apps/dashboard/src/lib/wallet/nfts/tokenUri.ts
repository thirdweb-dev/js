export function handleArbitraryTokenURI(rawUri: string): string {
  if (rawUri.startsWith("ipfs://")) {
    return rawUri;
  }
  if (!rawUri.includes("ipfs")) {
    return rawUri;
  }
  const uriSplit = `ipfs://${rawUri.split("/ipfs/")}`;

  return uriSplit[uriSplit.length - 1];
}

export function shouldDownloadURI(rawUri: string): boolean {
  return handleArbitraryTokenURI(rawUri).startsWith("ipfs://");
}
