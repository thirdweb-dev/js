import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  type TokenContract,
  type useContract,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { BigNumber } from "ethers";
import { FaBurn } from "react-icons/fa";
import { useActiveAccount } from "thirdweb/react";
import { Button, Drawer } from "tw-components";
import { TokenBurnForm } from "./burn-form";

interface TokenBurnButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const TokenBurnButton: React.FC<TokenBurnButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useActiveAccount()?.address;

  const tokenBalance = useTokenBalance(contractQuery.contract, address);

  const isERC20Burnable = detectFeatures<TokenContract>(
    contractQuery.contract,
    ["ERC20Burnable"],
  );

  if (!isERC20Burnable || !contractQuery.contract) {
    return null;
  }

  const hasBalance = BigNumber.from(tokenBalance?.data?.value || 0).gt(0);

  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <TokenBurnForm contract={contractQuery.contract} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FaBurn} />}
        {...restButtonProps}
        onClick={onOpen}
        isDisabled={!hasBalance}
      >
        Burn
      </Button>
    </>
  );
};
