import type { UseMutationResult } from "@tanstack/react-query";
import { FileInput } from "components/shared/FileInput";
import { useErrorHandler } from "contexts/error-handler";
import { UploadIcon } from "lucide-react";
import { Button, type ButtonProps } from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";

interface IpfsUploadButtonProps extends ButtonProps {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  storageUpload: UseMutationResult<string[], unknown, any, unknown>;
  onUpload: (uri: string) => void;
}

export const IpfsUploadButton: ComponentWithChildren<IpfsUploadButtonProps> = ({
  storageUpload,
  onUpload,
  children,
  ...buttonProps
}) => {
  const { onError } = useErrorHandler();
  const handleUpload = (file: File) => {
    storageUpload.mutate([file], {
      onSuccess: ([uri]) => onUpload(uri),
      onError: (error) => onError(error, "Failed to upload file"),
    });
  };

  return (
    <FileInput setValue={handleUpload}>
      <Button
        size="sm"
        variant="solid"
        aria-label="Upload to IPFS"
        rightIcon={<UploadIcon className="size-4" />}
        isLoading={storageUpload.isPending}
        {...buttonProps}
      >
        {children}
      </Button>
    </FileInput>
  );
};
