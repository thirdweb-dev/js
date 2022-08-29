import { BatchLazyMint } from "./batch-lazy-mint";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { NFTContract } from "@thirdweb-dev/react";
import { Erc721 } from "@thirdweb-dev/sdk";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import React from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { Button, Drawer } from "tw-components";

interface BatchLazyMintButtonProps {
  contract: NFTContract;
}

export const BatchLazyMintButton: React.FC<BatchLazyMintButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const detectedState = extensionDetectedState({
    contract,
    feature: ["ERC721Droppable", "ERC1155Droppable"],
  });

  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <BatchLazyMint
          contract={contract as Erc721}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Drawer>
      {detectedState === "enabled" && (
        <Button
          colorScheme="primary"
          leftIcon={<Icon as={RiCheckboxMultipleBlankLine} />}
          {...restButtonProps}
          onClick={onOpen}
        >
          Batch Upload
        </Button>
      )}
    </>
  );
};
