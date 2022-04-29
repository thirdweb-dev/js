import { ButtonGroup, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import type { Erc721 } from "@thirdweb-dev/sdk";
import { MismatchButton } from "components/buttons/MismatchButton";
import { MintDrawer } from "components/shared/MintDrawer";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { Heading } from "tw-components";

const QueryAllTable = dynamic(() => import("./query-all-table"));

interface NftOverviewPageProps {
  contract: Erc721<any>;
}

const NftOverviewPage: React.VFC<NftOverviewPageProps> = ({ contract }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const contractSupportsMinting = useMemo(() => {
    return !!contract.mint?.to;
  }, [contract]);

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract Tokens</Heading>
        <ButtonGroup>
          <MismatchButton
            isDisabled={!contractSupportsMinting}
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="primary"
            onClick={onOpen}
          >
            {contractSupportsMinting ? "Mint" : "Minting not supported"}
          </MismatchButton>
          <MintDrawer isOpen={isOpen} onClose={onClose} contract={contract} />
        </ButtonGroup>
      </Flex>
      {contract.query?.all ? <QueryAllTable contract={contract} /> : null}
    </Flex>
  );
};

export default NftOverviewPage;
