import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { type useContract, useMintNFT } from "@thirdweb-dev/react";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { FiPlus } from "react-icons/fi";
import { getContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { NFTMintForm } from "./mint-form";

interface NFTMintButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const NFTMintButton: React.FC<NFTMintButtonProps> = ({
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
  const mutation = useMintNFT(contractV4);
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
        <NFTMintForm contract={contractV4} mintMutation={mutation} />
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
