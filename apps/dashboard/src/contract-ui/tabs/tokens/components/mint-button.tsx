import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import type { useContract } from "@thirdweb-dev/react";
import { thirdwebClient } from "lib/thirdweb-client";
import { defineDashboardChain } from "lib/v5-adapter";
import { FiPlus } from "react-icons/fi";
import { getContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { TokenMintForm } from "./mint-form";

interface TokenMintButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const TokenMintButton: React.FC<TokenMintButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contractV4 = contractQuery.contract;
  const contract = contractV4
    ? getContract({
        address: contractV4.getAddress(),
        chain: defineDashboardChain(contractV4.chainId),
        client: thirdwebClient,
      })
    : null;
  if (!contract || !contractV4) {
    return null;
  }
  return (
    <MinterOnly contract={contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <TokenMintForm contract={contractV4} />
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
