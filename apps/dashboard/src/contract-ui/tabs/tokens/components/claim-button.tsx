import { Icon, useDisclosure } from "@chakra-ui/react";
import type { TokenContract, useContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { GiDiamondHard } from "react-icons/gi";
import { Button, Drawer } from "tw-components";
import { TokenClaimForm } from "./claim-form";

interface TokenClaimButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const TokenClaimButton: React.FC<TokenClaimButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isERC20Claimable = detectFeatures<TokenContract>(
    contractQuery.contract,
    [
      "ERC20ClaimConditionsV1",
      "ERC20ClaimConditionsV2",
      "ERC20ClaimPhasesV1",
      "ERC20ClaimPhasesV2",
    ],
  );

  if (!isERC20Claimable || !contractQuery.contract) {
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
        <TokenClaimForm contract={contractQuery.contract} />
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
