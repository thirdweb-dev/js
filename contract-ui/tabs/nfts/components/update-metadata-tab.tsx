import { NFTMintForm } from "./mint-form";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { SmartContract, useUpdateNFTMetadata } from "@thirdweb-dev/react";
import { NFT } from "thirdweb";
import { Button, Drawer, Text } from "tw-components";

interface UpdateMetadataTabProps {
  contract: SmartContract | null;
  nft: NFT;
}

const UpdateMetadataTab: React.FC<UpdateMetadataTabProps> = ({
  contract,
  nft,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mutation = useUpdateNFTMetadata(contract);

  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTMintForm
          contract={contract}
          updateMetadataMutation={mutation}
          nft={nft}
        />
      </Drawer>
      <Flex direction={"column"} gap={6}>
        <Text>
          You can update the metadata of this NFT at any time, this will only
          change the representation of the NFT, not the owner or tokenId.
        </Text>
        <Flex justifyContent={"right"}>
          <Button colorScheme="primary" onClick={onOpen}>
            Update Metadata
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default UpdateMetadataTab;
