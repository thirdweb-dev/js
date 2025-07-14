export function parseAddresses(addresses: string | undefined): string[] {
  if (!addresses) return [];
  return addresses
    .split(/[,\s]+/)
    .map((addr) => addr.trim())
    .filter(Boolean);
}
