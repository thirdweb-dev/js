import { TokenBurnForm } from "./burn-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
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
      >
        Burn
      </Button>
    </>
  );
};
