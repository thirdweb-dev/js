import { Icon } from "@chakra-ui/react";
import { useStorageUpload } from "@thirdweb-dev/react";
import { FileInput } from "components/shared/FileInput";
import { useErrorHandler } from "contexts/error-handler";
import { FiUpload } from "react-icons/fi";
import { Button } from "tw-components";

export const IconUpload: React.FC<{ onUpload: (url: string) => void }> = ({
  onUpload,
}) => {
  const errorHandler = useErrorHandler();
  const storageUpload = useStorageUpload();

  const handleIconUpload = (file: File) => {
    // if file size is larger than 5000kB, show error
    if (file.size > 5000 * 1024) {
      errorHandler.onError("Icon image can not be larger than 5MB");
      return;
    }

    storageUpload.mutate(
      { data: [file] },
      {
        onSuccess([uri]) {
          onUpload(uri);
        },
        onError(error) {
          errorHandler.onError(error, "Failed to upload file");
        },
      },
    );
  };

  return (
    <FileInput setValue={handleIconUpload} accept={{ "image/*": [] }}>
      <Button
        bg="inputBg"
        size="sm"
        variant="solid"
        aria-label="Upload to IPFS"
        rightIcon={<Icon as={FiUpload} />}
        isLoading={storageUpload.isLoading}
      >
        Upload Icon
      </Button>
    </FileInput>
  );
};
