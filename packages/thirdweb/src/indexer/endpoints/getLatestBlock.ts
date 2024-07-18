// TODO clarify the types, no need to sanitize here because we are already doing it server-side?
export async function getLatestBlock(client: any, params: any) {
  const blocksResponse = await client(params);
  // TODO: Calrify structured return type through the indexer
  return await blocksResponse.json();
}
