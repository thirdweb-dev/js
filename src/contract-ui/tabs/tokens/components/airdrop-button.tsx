import { TokenAirdropForm } from "./airdrop-form";
import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  TokenContract,
  useAddress,
  useContract,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
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
  const tokenBalance = useTokenBalance(contractQuery.contract, address);
  const hasBalance = BigNumber.from(tokenBalance?.data?.value || 0).gt(0);

  const isErc20 = detectFeatures<TokenContract>(contractQuery.contract, [
    "ERC20",
  ]);

  if (!isErc20 || !contractQuery.contract) {
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
        <TokenAirdropForm contract={contractQuery.contract} />
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
