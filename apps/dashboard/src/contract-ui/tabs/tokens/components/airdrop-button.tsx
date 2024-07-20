import { thirdwebClient } from "@/constants/client";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useMemo } from "react";
import { FiDroplet } from "react-icons/fi";
import { getContract } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc20";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { Button, Drawer } from "tw-components";
import { TokenAirdropForm } from "./airdrop-form";

interface TokenAirdropButtonProps {
  contractAddress: string;
  chainId: number;
}

export const TokenAirdropButton: React.FC<TokenAirdropButtonProps> = ({
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
        <TokenAirdropForm contract={contract} />
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
