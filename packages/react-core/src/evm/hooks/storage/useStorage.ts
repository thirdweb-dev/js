import { useSDK } from "../useSDK";

/**
 * Get the instance of the `ThirdwebStorage` class being used by the `ThirdwebProvider`
 *
 * Allows you to use the TypeScript SDK functionality of [Storage](https://portal.thirdweb.com/storage) in your React app.
 *
 * @example
 *
 * ```jsx
 * import { useStorage } from "@thirdweb-dev/react";
 *
 * export default function Component() {
 *   const storage = useStorage();
 *
 *   // Now you can use the functionality of the ThirdwebStorage class:
 *   storage?.download(); // Download a file from IPFS
 *   storage?.upload(); // Upload a file to IPFS
 * }
 * ```
 *
 * @remarks
 *
 * ### API Key
 *
 * You will require an API key to use thirdweb’s storage services with the SDK. If you haven’t created a key yet you can do so for free from the [**thirdweb dashboard**](https://thirdweb.com/create-api-key).
 *
 * You can then obtain a `clientId` from the API key which you will need to pass to the `ThirdwebProvider` component:
 *
 *
 * ```jsx
 * import { ThirdwebProvider } from "@thirdweb-dev/react";
 *
 * const App = () => {
 *   return (
 *     <ThirdwebProvider clientId="YOUR_CLIENT_ID">
 *       <YourApp />
 *     </ThirdwebProvider>
 *   );
 * };
 * ```
 *
 * Storage can also be configured using the `storageInterface` prop on `ThirdwebProvider`
 *
 * @storage
 *
 */
export function useStorage() {
  const sdk = useSDK();
  return sdk?.storage;
}
