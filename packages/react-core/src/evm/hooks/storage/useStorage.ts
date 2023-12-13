import { useSDK } from "../useSDK";

/**
 * Get the configured `ThirdwebStorage` instance in the `ThirdwebProvider`.
 *
 * @returns The `storageInterface` configured on the `ThirdwebProvider`
 *
 * @example
 * ```tsx
 * const storage = useStorage();
 *
 * cost resp = storage?.download("ipfs-url"); // Download a file from IPFS
 * if (resp.ok) {
 *   const value = await resp?.json();
 * }
 *
 * const fileIpfsHash = await storage?.upload({
 *   name: 'file1',
 *   type: 'file-mime-type',
 *   uri: 'file-uri-on-device',
 * }); // Upload a file to IPFS
 * const objIpfsHash = await storage?.upload({key: 'value'}); // Upload an object to IPFS
 * const strIpfsHash = await storage?.upload('string-to-upload'); // Upload a string to IPFS
 * ```
 */
export function useStorage() {
  const sdk = useSDK();
  return sdk?.storage;
}
