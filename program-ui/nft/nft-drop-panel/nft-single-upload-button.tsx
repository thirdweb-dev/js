import { Icon, useDisclosure } from "@chakra-ui/react";
import { useClaimConditions, useLazyMint } from "@thirdweb-dev/react/solana";
import type { NFTDrop } from "@thirdweb-dev/sdk/solana";
import { NFTMintForm } from "contract-ui/tabs/nfts/components/mint-form";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

export const NFTSingleUploadButton: React.FC<{ program: NFTDrop }> = ({
  program,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mutation = useLazyMint(program);

  const { data: claimConditions } = useClaimConditions(program);
  const allLazyMinted =
    claimConditions?.totalAvailableSupply === claimConditions?.lazyMintedSupply;

  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTMintForm lazyMintMutation={mutation} ecosystem="solana" />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
        disabled={allLazyMinted}
      >
        Single Upload
      </Button>
    </>
  );
};
