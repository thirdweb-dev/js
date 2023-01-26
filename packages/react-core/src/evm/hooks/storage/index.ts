import { useSDK } from "../../providers/base";

export * from "./useStorageUpload";

/**
 * Get the configured `ThirdwebStorage` instance
 * @returns The `storageInterface` configured on the `ThirdwebProvider`
 */
export function useStorage() {
  const sdk = useSDK();
  return sdk?.storage;
}
