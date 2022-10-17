import { NFTClaimForm } from "./claim-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { GiDiamondHard } from "@react-icons/all-files/gi/GiDiamondHard";
import { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { Button, Drawer } from "tw-components";

interface NFTClaimButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const NFTClaimButton: React.FC<NFTClaimButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const detectedState = extensionDetectedState({
    contractQuery,
    feature: ["ERC721Claimable"],
  });

  if (detectedState !== "enabled" || !contractQuery.contract) {
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
        <NFTClaimForm contract={contractQuery.contract} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={GiDiamondHard} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Claim
      </Button>
    </>
  );
};
