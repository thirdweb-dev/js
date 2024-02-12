import { SolidityInputWithTypeProps } from ".";
import { Box, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useStorageUpload } from "@thirdweb-dev/react";
import { IpfsUploadButton } from "components/ipfs-upload/button";
import { PINNED_FILES_QUERY_KEY_ROOT } from "components/storage/your-files";

export const SolidityStringInput: React.FC<SolidityInputWithTypeProps> = ({
  formContext: form,
  solidityName,
  functionName,
  ...inputProps
}) => {
  const storageUpload = useStorageUpload();
  const queryClient = useQueryClient();
  const { name, ...restOfInputProps } = inputProps;
  const inputName = name as string;
  const nameOrInput = (solidityName as string) || inputName;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    form.setValue(inputName, value, { shouldDirty: true });
  };

  const showButton =
    (nameOrInput?.toLowerCase().includes("uri") ||
      nameOrInput?.toLowerCase().includes("ipfs") ||
      nameOrInput?.toLowerCase().includes("audit") ||
      nameOrInput === "imageUrl") &&
    nameOrInput !== "_baseURIForTokens";

  return (
    <InputGroup display="flex">
      <Input
        placeholder="string"
        isDisabled={storageUpload.isLoading}
        pr={{ base: "90px", md: "160px" }}
        {...restOfInputProps}
        value={form.watch(inputName)}
        onChange={handleChange}
      />
      {showButton && (
        <InputRightElement mx={1} width={{ base: "75px", md: "145px" }}>
          <IpfsUploadButton
            onUpload={(uri) => {
              if (functionName) {
                if (functionName === "updateBatchBaseURI") {
                  // 1. Todo: Ensure user enters a folder CID and not a file (important)

                  // 2. Make sure there's a trailing slash at the end
                  // Otherwise the token URI will become `${uri}${tokenId}` when it should be `${uri}/${tokenId}`
                  if (!uri.endsWith("/")) {
                    uri += "/";
                  }
                }
              }
              form.setValue(inputName, uri, { shouldDirty: true });
              // also refetch the files list
              queryClient.invalidateQueries([PINNED_FILES_QUERY_KEY_ROOT]);
            }}
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
