import { useSDK } from "../../providers/thirdweb-sdk-provider";
import { useMutation } from "@tanstack/react-query";
import { IpfsUploadBatchOptions, UploadOptions } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";

interface StorageUploadOptions<T extends UploadOptions> {
  data: unknown[];
  options?: T;
}

/**
 * Hook used to upload any files or JSON data to decentralized storage systems like IPFS,
 * using the `storageInterface` configured on the `ThirdwebProvider`
 *
 * @param options - Configure the options for your upload
 * @returns Function used to upload files or JSON to decentralized storage systems
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
 * @see {@link https://portal.thirdweb.com/react/react.usestorageupload?utm_source=sdk | Documentation}
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
