"use client";
import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { useDisclosure } from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { LazyMintNftForm } from "./lazy-mint-form";

interface NFTLazyMintButtonProps {
  contract: ThirdwebContract;
  isErc721: boolean;
}

export const NFTLazyMintButton: React.FC<NFTLazyMintButtonProps> = ({
  contract,
  isErc721,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <MinterOnly contract={contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <LazyMintNftForm contract={contract} isErc721={isErc721} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<PlusIcon className="size-5" />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Single Upload
      </Button>
    </MinterOnly>
  );
};
