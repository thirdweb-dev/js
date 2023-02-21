import { SolidityInputWithTypeProps } from ".";
import { Box, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useStorageUpload } from "@thirdweb-dev/react";
import { IpfsUploadButton } from "components/ipfs-upload/button";

export const SolidityStringInput: React.FC<SolidityInputWithTypeProps> = ({
  formContext: form,
  solidityName,
  ...inputProps
}) => {
  const storageUpload = useStorageUpload();
  const inputName = inputProps.name as string;
  const nameOrInput = (solidityName as string) || inputName;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    form.setValue(inputName, value, { shouldDirty: true });
  };

  const showButton =
    (nameOrInput?.toLowerCase().includes("uri") ||
      nameOrInput?.toLowerCase().includes("ipfs")) &&
    nameOrInput !== "_baseURIForTokens";

  return (
    <InputGroup display="flex">
      <Input
        placeholder="string"
        isDisabled={storageUpload.isLoading}
        value={form.watch(inputName)}
        {...inputProps}
        onChange={handleChange}
        pr={{ base: "90px", md: "160px" }}
      />
      {showButton && (
        <InputRightElement mx={1} width={{ base: "75px", md: "145px" }}>
          <IpfsUploadButton
            onUpload={(uri) =>
              form.setValue(inputName, uri, { shouldDirty: true })
            }
            storageUpload={storageUpload}
          >
            <Box display={{ base: "none", md: "block" }} mr={1} as="span">
              Upload to
            </Box>
            IPFS
          </IpfsUploadButton>
        </InputRightElement>
      )}
    </InputGroup>
  );
};
