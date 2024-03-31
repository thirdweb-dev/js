import { usePaymentsUploadToCloudflare } from "@3rdweb-sdk/react/hooks/usePayments";
import { Image } from "@chakra-ui/react";
import { FileInput } from "components/shared/FileInput";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";

// Max file size is 10 MB.
const maxFileSizeBytes = 10 * 1024 * 1024;

interface PaymentsSettingsFileUploaderProps {
  value: string;
  onUpdate: (fileUrl: string) => void;
}
export const PaymentsSettingsFileUploader: React.FC<
  PaymentsSettingsFileUploaderProps
> = ({ value, onUpdate }) => {
  const [imageUrl, setImageUrl] = useState(value);
  const { mutate: uploadToCloudflare, isLoading } =
    usePaymentsUploadToCloudflare();

  const { onError } = useTxNotifications(
    "File uploaded successfully.",
    "Failed to upload file.",
  );

  const handleFileUpload = async (file: File) => {
    if (file.size > maxFileSizeBytes) {
      const message = `File size must be less than ${maxFileSizeBytes} bytes.`;
      onError(new Error(message));
      return;
    }

    const fileDataUrl = await readFileAsDataURL(file);
    uploadToCloudflare(fileDataUrl, {
      onSuccess: (resImageUrl) => {
        onUpdate(resImageUrl);
        setImageUrl(resImageUrl);
      },
      onError: (error) => {
        onError(error);
        console.error({ error });
      },
    });
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <FileInput
      accept={{ "image/*": [] }}
      value={value}
      setValue={handleFileUpload}
      isDisabled={isLoading}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      transition="all 200ms ease"
      _hover={{ shadow: "sm" }}
      renderPreview={() => <Image alt="" w="100%" h="100%" src={imageUrl} />}
      helperText="Image"
      isDisabledText="Uploading..."
    />
  );
};
