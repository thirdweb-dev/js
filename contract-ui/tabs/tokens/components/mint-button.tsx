import { TokenMintForm } from "./mint-form";
import { MinterOnly } from "@3rdweb-sdk/react";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { getErcs, useContract } from "@thirdweb-dev/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
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
  const { erc20 } = getErcs(contractQuery.contract);
  const { contract: actualContract } = useContract(erc20?.getAddress());

  const detectedState = extensionDetectedState({
    contractQuery,
    feature: ["ERC20Mintable"],
  });

  if (detectedState !== "enabled") {
    return null;
  }

  return (
    <MinterOnly contract={actualContract as unknown as ValidContractInstance}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <TokenMintForm contract={erc20} />
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
