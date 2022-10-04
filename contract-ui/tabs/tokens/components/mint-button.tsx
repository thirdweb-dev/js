import { TokenMintForm } from "./mint-form";
import { MinterOnly } from "@3rdweb-sdk/react";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { TokenContract, useContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

interface TokenMintButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const TokenMintButton: React.FC<TokenMintButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isERC20Mintable = detectFeatures<TokenContract>(
    contractQuery.contract,
    ["ERC20Mintable"],
  );

  if (!isERC20Mintable || !contractQuery.contract) {
    return null;
  }

  return (
    <MinterOnly contract={contractQuery.contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <TokenMintForm contract={contractQuery.contract} />
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
