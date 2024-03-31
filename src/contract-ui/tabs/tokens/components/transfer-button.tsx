import { TokenTransferForm } from "./transfer-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  TokenContract,
  useAddress,
  useContract,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { BigNumber } from "ethers";
import { FiSend } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

interface TokenTransferButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const TokenTransferButton: React.FC<TokenTransferButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useAddress();

  const tokenBalance = useTokenBalance(contractQuery.contract, address);

  const isERC20 = detectFeatures<TokenContract>(contractQuery.contract, [
    "ERC20",
  ]);

  if (!isERC20 || !contractQuery.contract) {
    return null;
  }

  const hasBalance = BigNumber.from(tokenBalance?.data?.value || 0).gt(0);

  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <TokenTransferForm contract={contractQuery.contract} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiSend} />}
        {...restButtonProps}
        onClick={onOpen}
        isDisabled={!hasBalance}
      >
        Transfer
      </Button>
    </>
  );
};
