import { useSDK } from "../useSDK";
import { useMutation } from "@tanstack/react-query";
import { IpfsUploadBatchOptions, UploadOptions } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";

interface StorageUploadOptions<T extends UploadOptions> {
  data: unknown[];
  options?: T;
}

/**
 * Hook for uploading files to IPFS and retrieving the IPFS URI.
 *
 * @example
 * ```jsx
 * import { useStorageUpload } from "@thirdweb-dev/react";
 *
 * export default function Component() {
 *   const { mutateAsync: upload, isLoading } = useStorageUpload();
 *
 *   async function uploadData() {
 *     const filesToUpload = [...];
 *     const uris = await upload({ data: files });
 *     console.log(uris);
 *   }
 *
 *   return (
 *     <button onClick={uploadData}>
 *       Upload
 *     </button>
 *   )
 * }
 * ```
 *
 * @remarks
 * ### API key
 *
 * You will require an API key to use thirdweb’s storage services with the SDK. If you haven’t created a key yet you can do so for free from the [**thirdweb dashboard**](https://thirdweb.com/create-api-key).
 *
 * You can then obtain a `clientId` from the API key which you will need to pass to the [`ThirdwebProvider`](/react/react.thirdwebprovider) component:
 *
 * ```jsx
 * import { ThirdwebProvider } from "@thirdweb/react";
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
 * @param options - Configure the options for your upload
 * ### rewriteFileNames (optional)
 *
 * If specified, will rewrite file names to numbers for use on-chain.
 *
 * Useful to use with NFT contracts that map token IDs to files.
 *
 * ```jsx
 * import { useStorageUpload } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { mutateAsync: upload } = useStorageUpload({
 *     rewriteFileNames: {
 *       fileStartNumber: 1,
 *     },
 *   });
 * }
 * ```
 *
 * ### uploadWithGatewayUrl (optional)
 *
 * If specified, any URLs with schemes will be replaced with resolved URLs before upload.
 *
 * ```jsx
 * import { useStorageUpload } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { mutateAsync: upload } = useStorageUpload({
 *     uploadWithGatewayUrl: true,
 *   });
 * }
 * ```
 *
 * ### onProgress (optional)
 *
 * Callback that gets triggered when file upload progresses.
 *
 * ```jsx
 * import { useStorageUpload } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { mutateAsync: upload } = useStorageUpload({
 *     onProgress: (progress) => {
 *       console.log(progress);
 *     },
 *   });
 * }
 * ```
 *
 * ### uploadWithoutDirectory (optional)
 *
 * If specified, will upload a single file without wrapping it in a directory.
 *
 * ```jsx
 * import { useStorageUpload } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { mutateAsync: upload } = useStorageUpload({
 *     uploadWithoutDirectory: true,
 *   });
 * }
 * ```
 *
 * @auth
 */
export function useStorageUpload<
  T extends UploadOptions = IpfsUploadBatchOptions,
>(uploadOptions?: T) {
  const sdk = useSDK();

  return useMutation(async ({ data, options }: StorageUploadOptions<T>) => {
    invariant(sdk, "sdk must be defined");

    return await sdk.storage.uploadBatch(data, options || uploadOptions);
  });
}
