import { NFTRevealForm } from "./reveal-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { NFTContract, useBatchesToReveal } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import React from "react";
import { FiEye } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

interface NFTRevealButtonProps {
  contract: NFTContract;
}

export const NFTRevealButton: React.FC<NFTRevealButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const detectedState = extensionDetectedState({
    contract,
    feature: ["ERC721Revealable", "ERC1155Revealable"],
  });

  const { data: batchesToReveal } = useBatchesToReveal(contract);

  if (detectedState !== "enabled") {
    return null;
  }

  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTRevealForm contract={contract} />
      </Drawer>
      {batchesToReveal?.length ? (
        <Button
          colorScheme="primary"
          leftIcon={<Icon as={FiEye} />}
          {...restButtonProps}
          onClick={onOpen}
        >
          Reveal NFTs
        </Button>
      ) : null}
    </>
  );
};
