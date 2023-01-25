import { SolidityInputWithTypeProps } from ".";
import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useStorageUpload } from "@thirdweb-dev/react";
import { FileInput } from "components/shared/FileInput";
import { useErrorHandler } from "contexts/error-handler";
import { FiUpload } from "react-icons/fi";
import { Button } from "tw-components";

export const SolidityStringInput: React.FC<SolidityInputWithTypeProps> = ({
  formContext: form,
  solidityName,
  ...inputProps
}) => {
  const inputName = inputProps.name as string;
  const nameOrInput = (solidityName as string) || inputName;
  const { onError } = useErrorHandler();
  const { mutate: upload, isLoading } = useStorageUpload();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    form.setValue(inputName, value, { shouldDirty: true });
  };

  const handleUpload = (file: File) => {
    upload(
      { data: [file] },
      {
        onSuccess: ([uri]) =>
          form.setValue(inputName, uri, { shouldDirty: true }),
        onError: (error) => onError(error, "Failed to upload file"),
      },
    );
  };

  const showButton =
    (nameOrInput?.toLowerCase().includes("uri") ||
      nameOrInput?.toLowerCase().includes("ipfs")) &&
    nameOrInput !== "_baseURIForTokens";

  return (
    <InputGroup display="flex">
      <Input
        placeholder="string"
        isDisabled={isLoading}
        value={form.watch(inputName)}
        {...inputProps}
        onChange={handleChange}
        pr={{ base: "90px", md: "160px" }}
      />
      {showButton && (
        <InputRightElement mx={1} width={{ base: "75px", md: "145px" }}>
          <FileInput setValue={handleUpload}>
            <Button
              size="sm"
              variant="solid"
              aria-label="Upload to IPFS"
              rightIcon={<Icon as={FiUpload} />}
              isLoading={isLoading}
            >
              <Box display={{ base: "none", md: "block" }} mr={1} as="span">
                Upload to
              </Box>
              IPFS
            </Button>
          </FileInput>
        </InputRightElement>
      )}
    </InputGroup>
  );
};
