import type { UseMutationResult } from "@tanstack/react-query";
import { Button, type ButtonProps } from "chakra/button";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { FileInput } from "@/components/blocks/FileInput";
import { useErrorHandler } from "@/contexts/error-handler";
import type { ComponentWithChildren } from "@/types/component-with-children";

interface IpfsUploadButtonProps extends ButtonProps {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  storageUpload: UseMutationResult<string[], unknown, any, unknown>;
  onUpload: (uri: string) => void;
  client: ThirdwebClient;
}

export const IpfsUploadButton: ComponentWithChildren<IpfsUploadButtonProps> = ({
  storageUpload,
  onUpload,
  children,
  client,
  ...buttonProps
}) => {
  const { onError } = useErrorHandler();
  const handleUpload = (file: File) => {
    storageUpload.mutate([file], {
      onError: (error) => onError(error, "Failed to upload file"),
      onSuccess: ([uri]) => {
        if (uri) {
          onUpload(uri);
        } else {
          toast.error("File Upload but no URI returned");
        }
      },
    });
  };

  return (
    <FileInput client={client} setValue={handleUpload}>
      <Button
        aria-label="Upload to IPFS"
        isLoading={storageUpload.isPending}
        rightIcon={<UploadIcon className="size-4" />}
        size="sm"
        variant="solid"
        {...buttonProps}
      >
        {children}
      </Button>
    </FileInput>
  );
};
