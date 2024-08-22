import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import type { ThirdwebContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { TokenERC20MintForm } from "./mint-form-erc20";

interface TokenMintButtonProps {
  contract: ThirdwebContract;
}

export const TokenMintButton: React.FC<TokenMintButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <MinterOnly contract={contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <TokenERC20MintForm contract={contract} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Mint
      </Button>
    </MinterOnly>
  );
};
