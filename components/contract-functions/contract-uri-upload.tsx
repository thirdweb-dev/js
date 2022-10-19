import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useStorageUpload } from "@thirdweb-dev/react";
import { FileInput } from "components/shared/FileInput";
import { useErrorHandler } from "contexts/error-handler";
import { FiUpload } from "react-icons/fi";
import { Button } from "tw-components";

interface ContractUriUploadProps {
  value: string;
  setValue: (value: string) => void;
}

export const ContractUriUpload: React.FC<ContractUriUploadProps> = ({
  value,
  setValue,
}) => {
  const { onError } = useErrorHandler();
  const { mutate: upload, isLoading } = useStorageUpload();

  return (
    <InputGroup>
      <Input
        defaultValue={value}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
      />
      <InputRightElement width="96px">
        <FileInput
          setValue={(file) =>
            upload(
              { data: [file] },
              {
                onSuccess: ([uri]) => setValue(uri),
                onError: (error) => onError(error, "Failed to upload file"),
              },
            )
          }
        >
          <Button
            size="xs"
            padding="3"
            paddingY="3.5"
            colorScheme="purple"
            aria-label="Upload"
            rightIcon={<Icon as={FiUpload} />}
            isLoading={isLoading}
          >
            Upload
          </Button>
        </FileInput>
      </InputRightElement>
    </InputGroup>
  );
};
