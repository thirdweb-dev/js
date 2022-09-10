import { TokenBurnForm } from "./burn-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  getErcs,
  useAddress,
  useContract,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { BigNumber } from "ethers";
import { FaBurn } from "react-icons/fa";
import { Button, Drawer } from "tw-components";

interface TokenBurnButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const TokenBurnButton: React.FC<TokenBurnButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useAddress();
  const { erc20 } = getErcs(contractQuery.contract);
  const tokenBalance = useTokenBalance(erc20, address);
  const hasBalance = BigNumber.from(tokenBalance?.data?.value || 0).gt(0);

  const detectedState = extensionDetectedState({
    contractQuery,
    feature: ["ERC20Burnable"],
  });

  if (detectedState !== "enabled") {
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
        <TokenBurnForm contract={erc20} />
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
