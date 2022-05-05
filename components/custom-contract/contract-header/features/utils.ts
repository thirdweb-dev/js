import { FeatureWithEnabled } from "@thirdweb-dev/sdk/dist/src/constants/contract-features";

export function convertFeaturesMapToarray(
  features?: Record<string, FeatureWithEnabled> | Array<FeatureWithEnabled>,
) {
  if (!features) {
    return [];
  }
  if (Array.isArray(features)) {
    return features;
  }
  return Object.entries(features).map(([, f]) => f);
}

export function replaceAddressesInCode(
  code: string,
  contractAddress?: string,
  walletAddress?: string,
) {
  code = code.replaceAll("{{contract_address}}", contractAddress || "0x...");
  code = code.replaceAll("{{wallet_address}}", walletAddress || "0x...");
  return code;
}
