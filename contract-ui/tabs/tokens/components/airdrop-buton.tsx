import { TokenAirdropForm } from "./airdrop-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import { ExtensionDetectButton } from "components/buttons/ExtensionDetectButton";
import React from "react";
import { FiDroplet } from "react-icons/fi";
import { Drawer } from "tw-components";

interface TokenAirdropButtonProps {
  contract: Erc20;
}

export const TokenAirdropButton: React.FC<TokenAirdropButtonProps> = ({
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
        <TokenAirdropForm contract={contract} />
      </Drawer>
      <ExtensionDetectButton
        colorScheme="primary"
        leftIcon={<Icon as={FiDroplet} />}
        {...restButtonProps}
        onClick={onOpen}
        contract={contract}
        feature="ERC20Mintable"
      >
        Airdrop
      </ExtensionDetectButton>
    </>
  );
};
