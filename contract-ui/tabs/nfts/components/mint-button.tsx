import { NFTMintForm } from "./mint-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { NFTContract } from "@thirdweb-dev/react";
import { ExtensionDetectButton } from "components/buttons/ExtensionDetectButton";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { Drawer } from "tw-components";

interface NFTMintButtonProps {
  contract: NFTContract;
}

export const NFTMintButton: React.FC<NFTMintButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTMintForm contract={contract} />
      </Drawer>
      <ExtensionDetectButton
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
        contract={contract}
        feature={["ERC721Mintable", "ERC1155Mintable"]}
      >
        Mint
      </ExtensionDetectButton>
    </>
  );
};
