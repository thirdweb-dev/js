import { NFTMintForm } from "./mint-form";
import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { useContract, useSetSharedMetadata } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

interface NFTSharedMetadataButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const NFTSharedMetadataButton: React.FC<
  NFTSharedMetadataButtonProps
> = ({ contractQuery, ...restButtonProps }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mutation = useSetSharedMetadata(contractQuery.contract);

  const detectedState = extensionDetectedState({
    contractQuery,
    feature: ["ERC721SharedMetadata"],
  });
  if (detectedState !== "enabled" || !contractQuery.contract) {
    return null;
  }

  return (
    <MinterOnly contract={contractQuery.contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTMintForm
          contract={contractQuery.contract}
          sharedMetadataMutation={mutation}
        />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Set NFT Metadata
      </Button>
    </MinterOnly>
  );
};
