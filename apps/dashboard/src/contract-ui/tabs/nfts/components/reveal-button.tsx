import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { useBatchesToReveal, type useContract } from "@thirdweb-dev/react";
import { thirdwebClient } from "lib/thirdweb-client";
import { defineDashboardChain } from "lib/v5-adapter";
import { FiEye } from "react-icons/fi";
import { getContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { NFTRevealForm } from "./reveal-form";

interface NFTRevealButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const NFTRevealButton: React.FC<NFTRevealButtonProps> = ({
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
  const { data: batchesToReveal } = useBatchesToReveal(contractV4);
  if (!contract || !contractV4) {
    return null;
  }
  return batchesToReveal?.length ? (
    <MinterOnly contract={contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTRevealForm contract={contractV4} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiEye} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Reveal NFTs
      </Button>
    </MinterOnly>
  ) : null;
};
