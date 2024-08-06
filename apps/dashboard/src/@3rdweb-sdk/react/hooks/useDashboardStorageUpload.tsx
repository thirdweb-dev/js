import { thirdwebClient } from "@/constants/client";
import { useMutation } from "@tanstack/react-query";
import { upload } from "thirdweb/storage";

type DashboardUploadOptions = {
  uploadWithoutDirectory?: boolean;
  metadata?: Record<string, string>;
};

export function useDashboardStorageUpload(options?: DashboardUploadOptions) {
  return useMutation({
    mutationFn: async (files: Array<File | string>): Promise<string[]> => {
      const uris = await upload({
        client: thirdwebClient,
        files,
        ...options,
      });
      // the upload method in SDK v5 has this logic
      // that will make it return only a string if you upload only 1 file
      if (typeof uris === "string") {
        return [uris];
      }
      return uris;
    },
  });
}
