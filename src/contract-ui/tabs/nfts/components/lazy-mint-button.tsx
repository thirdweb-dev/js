import { NFTMintForm } from "./mint-form";
import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { useContract, useLazyMint } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer } from "tw-components";

interface NFTLazyMintButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const NFTLazyMintButton: React.FC<NFTLazyMintButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mutation = useLazyMint(contractQuery.contract);

  const detectedState = extensionDetectedState({
    contractQuery,
    feature: [
      "ERC721LazyMintable",
      "ERC1155LazyMintableV1",
      "ERC1155LazyMintableV2",
    ],
  });

  if (detectedState !== "enabled" || !contractQuery.contract) {
    return null;
  }

  return (
    <MinterOnly contract={contractQuery.contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <NFTMintForm
          contract={contractQuery.contract}
          lazyMintMutation={mutation}
        />
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
