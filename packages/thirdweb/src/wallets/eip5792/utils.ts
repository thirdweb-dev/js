import type { WalletCapabilities, WalletCapabilitiesRecord } from "./types.js";

/**
 * @internal
 */
export function parseCapabilities(raw_capabilities: unknown) {
  const capabilities = {} as WalletCapabilitiesRecord<
    WalletCapabilities,
    number
  >;

  for (const [key, value] of Object.entries(
    raw_capabilities as Record<string, unknown>,
  )) {
    capabilities[Number(key)] = value as WalletCapabilities;
  }

  return capabilities;
}
