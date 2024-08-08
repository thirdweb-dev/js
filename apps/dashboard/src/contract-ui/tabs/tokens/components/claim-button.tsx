import { thirdwebClient } from "@/constants/client";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { useV5DashboardChain } from "lib/v5-adapter";
import { GiDiamondHard } from "react-icons/gi";
import { getContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { TokenClaimForm } from "./claim-form";

interface TokenClaimButtonProps {
  contractAddress: string;
  chainId: number;
}

export const TokenClaimButton: React.FC<TokenClaimButtonProps> = ({
  contractAddress,
  chainId,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chain = useV5DashboardChain(chainId);
  const contract = getContract({
    address: contractAddress,
    chain,
    client: thirdwebClient,
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
