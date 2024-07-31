import { thirdwebClient } from "@/constants/client";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useMemo } from "react";
import { FiSend } from "react-icons/fi";
import { getContract } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc20";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { Button, Drawer } from "tw-components";
import { TokenTransferForm } from "./transfer-form";

interface TokenTransferButtonProps {
  contractAddress: string;
  chainId: number;
}

export const TokenTransferButton: React.FC<TokenTransferButtonProps> = ({
  contractAddress,
  chainId,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useActiveAccount()?.address;

  const chain = useV5DashboardChain(chainId);

  const contract = useMemo(
    () =>
      getContract({
        address: contractAddress,
        chain,
        client: thirdwebClient,
      }),
    [chain, contractAddress],
  );

  const tokenBalanceQuery = useReadContract(balanceOf, {
    contract,
    address: address || "",
    queryOptions: { enabled: !!address },
  });

  const hasBalance = tokenBalanceQuery.data && tokenBalanceQuery.data > 0n;

  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <TokenTransferForm contract={contract} />
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
