import { TokenMintForm } from "./mint-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import { ExtensionDetectButton } from "components/buttons/ExtensionDetectButton";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { Drawer } from "tw-components";

interface TokenMintButtonProps {
  contract: Erc20;
}

export const TokenMintButton: React.FC<TokenMintButtonProps> = ({
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
        <TokenMintForm contract={contract} />
      </Drawer>
      <ExtensionDetectButton
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
        contract={contract}
        feature="ERC20Mintable"
      >
        Mint
      </ExtensionDetectButton>
    </>
  );
};
