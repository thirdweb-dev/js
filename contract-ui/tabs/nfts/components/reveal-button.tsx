import { NFTRevealForm } from "./reveal-form";
import { MinterOnly } from "@3rdweb-sdk/react";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { useBatchesToReveal, useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { FiEye } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

interface NFTRevealButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const NFTRevealButton: React.FC<NFTRevealButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const detectedState = extensionDetectedState({
    contractQuery,
    feature: ["ERC721Revealable", "ERC1155Revealable"],
  });

  const { data: batchesToReveal } = useBatchesToReveal(contractQuery.contract);

  if (detectedState !== "enabled" || !contractQuery.contract) {
    return null;
  }

  return batchesToReveal?.length ? (
    <MinterOnly contract={contractQuery.contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTRevealForm contract={contractQuery.contract} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiEye} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Reveal NFTs
      </Button>
    </MinterOnly>
  ) : null;
};
