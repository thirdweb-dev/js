import { useDisclosure } from "@chakra-ui/react";
import { GemIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { NFTClaimForm } from "./claim-form";

interface NFTClaimButtonProps {
  contract: ThirdwebContract;
}

/**
 * This button is used for claiming NFT Drop contract (erc721) only!
 * For Edition Drop we have a dedicated ClaimTabERC1155 inside each Edition's page
 */
export const NFTClaimButton: React.FC<NFTClaimButtonProps> = ({ contract }) => {
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
        <NFTClaimForm contract={contract} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<GemIcon className="size-4" />}
        onClick={onOpen}
      >
        Claim
      </Button>
    </>
  );
};
