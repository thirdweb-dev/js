import { Icon, useDisclosure } from "@chakra-ui/react";
import { GiDiamondHard } from "react-icons/gi";
import type { ThirdwebContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { TokenClaimForm } from "./claim-form";

interface TokenClaimButtonProps {
  contract: ThirdwebContract;
}

export const TokenClaimButton: React.FC<TokenClaimButtonProps> = ({
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
        <TokenClaimForm contract={contract} />
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
