import { NFTGetAllTable } from "./components/table";
import { Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { useMintNFT } from "@thirdweb-dev/react/solana";
import type { NFTCollection } from "@thirdweb-dev/sdk/solana";
import { NFTMintForm } from "contract-ui/tabs/nfts/components/mint-form";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer, Heading } from "tw-components";

export const NFTCollectionPanel: React.FC<{
  program: NFTCollection;
}> = ({ program }) => {
  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Program NFTs</Heading>
        <Flex gap={2} flexDir={{ base: "column", md: "row" }}>
          <NFTMintButton program={program} />
        </Flex>
      </Flex>
      <NFTGetAllTable program={program} />
    </Flex>
  );
};

export const NFTMintButton: React.FC<{ program: NFTCollection }> = ({
  program,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mutation = useMintNFT(program);
  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTMintForm mintMutation={mutation} ecosystem={"solana"} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Mint
      </Button>
    </>
  );
};
