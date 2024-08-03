import { Icon, useDisclosure } from "@chakra-ui/react";
import { GiDiamondHard } from "@react-icons/all-files/gi/GiDiamondHard";
import { Button, Drawer } from "tw-components";
import { NFTClaimForm } from "./claim-form";

interface NFTClaimButtonProps {
  contractAddress: string;
  chainId: number;
}

export const NFTClaimButton: React.FC<NFTClaimButtonProps> = ({
  contractAddress,
  chainId,
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
        <NFTClaimForm contractAddress={contractAddress} chainId={chainId} />
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
