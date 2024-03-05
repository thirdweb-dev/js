import { NFTMintForm } from "./mint-form";
import { useDisclosure } from "@chakra-ui/react";
import { SmartContract, useUpdateNFTMetadata } from "@thirdweb-dev/react";
import { NFT } from "thirdweb";
import { Button, Drawer } from "tw-components";

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
      <Button colorScheme="primary" onClick={onOpen}>
        Update Metadata
      </Button>
    </>
  );
};

export default UpdateMetadataTab;