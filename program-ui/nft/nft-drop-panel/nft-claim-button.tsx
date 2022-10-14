import { NFTClaimForm } from "./nft-claim";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { GiDiamondHard } from "@react-icons/all-files/gi/GiDiamondHard";
import { useDropUnclaimedSupply } from "@thirdweb-dev/react/solana";
import { NFTDrop } from "@thirdweb-dev/sdk/solana";
import { Button, Drawer } from "tw-components";

export const NFTClaimButton: React.FC<{ program: NFTDrop }> = ({
  program,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: unclaimedSupply } = useDropUnclaimedSupply(program);

  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTClaimForm program={program} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={GiDiamondHard} color="white" />}
        {...restButtonProps}
        onClick={onOpen}
        disabled={unclaimedSupply === 0}
      >
        Claim
      </Button>
    </>
  );
};
