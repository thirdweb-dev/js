import { useSDK } from "../../providers/thirdweb-sdk-provider";

export { useStorageUpload } from "./useStorageUpload";

/**
 * Get the configured `ThirdwebStorage` instance
 * @returns The `storageInterface` configured on the `ThirdwebProvider`
 * @see {@link https://portal.thirdweb.com/react/react.usestorage?utm_source=sdk | Documentation}
 */
export function useStorage() {
  const sdk = useSDK();
  return sdk?.storage;
}
