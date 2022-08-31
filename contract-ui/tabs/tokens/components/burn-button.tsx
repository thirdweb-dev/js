import { TokenBurnForm } from "./burn-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { useAddress, useTokenBalance } from "@thirdweb-dev/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { BigNumber } from "ethers";
import React from "react";
import { FaBurn } from "react-icons/fa";
import { Button, Drawer } from "tw-components";

interface TokenBurnButtonProps {
  contract: Erc20;
}

export const TokenBurnButton: React.FC<TokenBurnButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useAddress();
  const tokenBalance = useTokenBalance(contract, address);
  const hasBalance = BigNumber.from(tokenBalance?.data?.value || 0).gt(0);

  const detectedState = extensionDetectedState({
    contract,
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
        <TokenBurnForm contract={contract} />
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
