import { TokenAirdropForm } from "./airdrop-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import React from "react";
import { FiDroplet } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

interface TokenAirdropButtonProps {
  contract: Erc20;
}

export const TokenAirdropButton: React.FC<TokenAirdropButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const detectedState = extensionDetectedState({
    contract,
    feature: ["ERC20"],
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
        <TokenAirdropForm contract={contract} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiDroplet} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Airdrop
      </Button>
    </>
  );
};
