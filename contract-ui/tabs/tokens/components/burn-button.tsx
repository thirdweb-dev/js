import { TokenBurnForm } from "./burn-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import { ExtensionDetectButton } from "components/buttons/ExtensionDetectButton";
import React from "react";
import { FaBurn } from "react-icons/fa";
import { Drawer } from "tw-components";

interface TokenBurnButtonProps {
  contract: Erc20;
}

export const TokenBurnButton: React.FC<TokenBurnButtonProps> = ({
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
        <TokenBurnForm contract={contract} />
      </Drawer>
      <ExtensionDetectButton
        colorScheme="primary"
        leftIcon={<Icon as={FaBurn} />}
        {...restButtonProps}
        onClick={onOpen}
        contract={contract}
        feature="ERC20Burnable"
      >
        Burn
      </ExtensionDetectButton>
    </>
  );
};
