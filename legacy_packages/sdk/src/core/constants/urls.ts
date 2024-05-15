/**
 * @internal
 */
export function getRpcUrl(network: string, clientId?: string) {
  return `https://${network}.rpc.thirdweb.com/${clientId || ""}`;
}
