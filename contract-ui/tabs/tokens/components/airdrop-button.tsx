import { TokenAirdropForm } from "./airdrop-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  getErcs,
  useAddress,
  useContract,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { BigNumber } from "ethers";
import { FiDroplet } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

interface TokenAirdropButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const TokenAirdropButton: React.FC<TokenAirdropButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useAddress();
  const { erc20 } = getErcs(contractQuery.contract);
  const tokenBalance = useTokenBalance(erc20, address);
  const hasBalance = BigNumber.from(tokenBalance?.data?.value || 0).gt(0);

  const detectedState = extensionDetectedState({
    contractQuery,
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
        <TokenAirdropForm contract={erc20} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiDroplet} />}
        {...restButtonProps}
        onClick={onOpen}
        isDisabled={!hasBalance}
      >
        Airdrop
      </Button>
    </>
  );
};
