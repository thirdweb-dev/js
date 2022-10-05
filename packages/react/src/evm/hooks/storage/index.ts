import { useSDK } from "../../providers/base";
import { IpfsUploadBatchOptions, UploadOptions } from "@thirdweb-dev/storage";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface UseStorageOptions<T extends UploadOptions> {
  onUpload: (uris: string[]) => void;
  uploadOptions?: T;
}

/**
 * Hook used to turn any component into a file input that uploads files to decentralized storage
 * systems like IPFS, using the `storageInterface` configured on the `ThirdwebProvider`
 *
 * @param options - Configure the options for your upload
 * @param options.onUpload - A callback function to call on the URIs of the uploaded files
 * @param options.uploadOptions - Options to pass to the storage `uploadBatch` function
 * @returns Standard dropzone compatible hooks for uploading to decentralized storage
 *
 * @example
 * ```jsx
 * export default function Component() {
 *   const onUpload = React.useCallback((uris) => {
 *     // Do something with the URIs here
 *     console.log(uris);
 *   })
 *   const { getRootProps, getInputProps } = useStorage({ onUpload });
 *
 *   return (
 *     <div {...getRootProps()}>
 *       <input {...getInputProps()} />
 *       <p>Drag files here to upload to decentralized storage</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useStorage<T extends UploadOptions = IpfsUploadBatchOptions>({
  onUpload,
  uploadOptions,
}: UseStorageOptions<T>) {
  const sdk = useSDK();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (sdk) {
        const uris = await sdk.storage.uploadBatch(
          acceptedFiles,
          uploadOptions,
        );
        onUpload(uris);
      }
    },
    [sdk, onUpload, uploadOptions],
  );

  return useDropzone({ onDrop });
}
