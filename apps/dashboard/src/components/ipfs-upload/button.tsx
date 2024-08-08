import { Icon } from "@chakra-ui/react";
import type { UseMutationResult } from "@tanstack/react-query";
import { FileInput } from "components/shared/FileInput";
import { useErrorHandler } from "contexts/error-handler";
import { FiUpload } from "react-icons/fi";
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
        rightIcon={<Icon as={FiUpload} />}
        isLoading={storageUpload.isLoading}
        {...buttonProps}
      >
        {children}
      </Button>
    </FileInput>
  );
};
