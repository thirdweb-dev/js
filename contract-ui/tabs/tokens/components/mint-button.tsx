import { TokenMintForm } from "./mint-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

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
      <Button
        {...restButtonProps}
        onClick={onOpen}
        leftIcon={<Icon as={FiPlus} />}
      >
        Mint
      </Button>
    </>
  );
};
