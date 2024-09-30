"use client";

import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";
import type { ThirdwebContract } from "thirdweb";
import { getBatchesToReveal } from "thirdweb/extensions/erc721";
import { useReadContract } from "thirdweb/react";
import { Button, Drawer } from "tw-components";
import { NFTRevealForm } from "./reveal-form";

interface NFTRevealButtonProps {
  contract: ThirdwebContract;
}

export const NFTRevealButton: React.FC<NFTRevealButtonProps> = ({
  contract,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const batchesQuery = useReadContract(getBatchesToReveal, {
    contract,
  });
  return batchesQuery.data?.length ? (
    <MinterOnly contract={contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTRevealForm
          contract={contract}
          batchesToReveal={batchesQuery.data}
        />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiEye} />}
        onClick={onOpen}
      >
        Reveal NFTs
      </Button>
    </MinterOnly>
  ) : null;
};
