import { Icon, useDisclosure } from "@chakra-ui/react";
import { GiDiamondHard } from "@react-icons/all-files/gi/GiDiamondHard";
import type { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { Button, Drawer } from "tw-components";
import { NFTClaimForm } from "./claim-form";

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
    feature: [
      // erc 721
      "ERC721ClaimPhasesV1",
      "ERC721ClaimPhasesV2",
      "ERC721ClaimConditionsV1",
      "ERC721ClaimConditionsV2",
      "ERC721ClaimCustom",
    ],
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
