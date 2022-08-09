import { TokenTransferForm } from "./transfer-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import { ExtensionDetectButton } from "components/buttons/ExtensionDetectButton";
import React from "react";
import { FiSend } from "react-icons/fi";
import { Drawer } from "tw-components";

interface TokenTransferButtonProps {
  contract: Erc20;
}

export const TokenTransferButton: React.FC<TokenTransferButtonProps> = ({
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
        <TokenTransferForm contract={contract} />
      </Drawer>
      <ExtensionDetectButton
        colorScheme="primary"
        leftIcon={<Icon as={FiSend} />}
        {...restButtonProps}
        onClick={onOpen}
        contract={contract}
        feature="ERC20"
      >
        Transfer
      </ExtensionDetectButton>
    </>
  );
};
