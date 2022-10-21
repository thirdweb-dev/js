export const DEFAULT_API_KEY =
  "c6634ad2d97b74baf15ff556016830c251050e6c36b9da508ce3ec80095d3dc1";

export function getRpcUrl(network: string) {
  return `https://${network}.rpc.thirdweb.com/${DEFAULT_API_KEY}`;
}
