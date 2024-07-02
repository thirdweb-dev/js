import { Flex, Input } from "@chakra-ui/react";
import { useContractPublishMetadataFromURI, useFunctionParamsFromABI } from "../hooks";
import { ExtendedPublishedContract } from "../published-contract";

interface ExtensionInstallParamsProps {
  extension: ExtendedPublishedContract;
}

export const ExtensionInstallParams: React.FC<ExtensionInstallParamsProps> = ({
  extension
}) => {

  const extensionPublishMetadata = useContractPublishMetadataFromURI(
    extension.metadataUri,
  );

  const abi = extensionPublishMetadata.data?.abi;

  const installParams = useFunctionParamsFromABI(abi, "encodeBytesOnInstall");

  return (
    <Flex pb={4} direction="column" gap={2}>
      {installParams.map((p) => {

                return (
                  <>
                  <text>{p.name}</text>
                  <Input type="text"/>
                  </>
                );
              })}
    </Flex>
  );
};
