"use client";

import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { useDisclosure } from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { Button, Drawer } from "tw-components";
import { SharedMetadataForm } from "./shared-metadata-form";

interface NFTSharedMetadataButtonProps {
  contract: ThirdwebContract;
}

export const NFTSharedMetadataButton: React.FC<
  NFTSharedMetadataButtonProps
> = ({ contract, ...restButtonProps }) => {
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
        <SharedMetadataForm contract={contract} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<PlusIcon className="size-5" />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Set NFT Metadata
      </Button>
    </MinterOnly>
  );
};
