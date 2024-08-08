import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { type useContract, useLazyMint } from "@thirdweb-dev/react";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { FiPlus } from "react-icons/fi";
import { getContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { NFTMintForm } from "./mint-form";

interface NFTLazyMintButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const NFTLazyMintButton: React.FC<NFTLazyMintButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const contractV4 = contractQuery.contract;
  const chain = useV5DashboardChain(contractV4?.chainId);
  const contract =
    contractV4 && chain
      ? getContract({
          address: contractV4.getAddress(),
          chain: chain,
          client: thirdwebClient,
        })
      : null;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mutation = useLazyMint(contractV4);
  if (!contract) {
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
        <NFTMintForm contract={contractV4} lazyMintMutation={mutation} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Single Upload
      </Button>
    </MinterOnly>
  );
};
