import { IContractActionButtonProps } from "./types";
import { useActiveChainId, useWeb3 } from "@3rdweb-sdk/react";
import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import { Flex, Icon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { ChainId } from "@thirdweb-dev/react";
import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { MintDrawer } from "components/shared/MintDrawer";
import { FiPlus } from "react-icons/fi";
import { Button } from "tw-components";

// currently not supported by alchemy or moralis
const UNSUPPORTED_CHAINS = [ChainId.FantomTestnet];

export interface IListButtonProps extends IContractActionButtonProps {}
export const ListButton: React.FC<IListButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const { chainId } = useWeb3();
  const activeChainId = useActiveChainId();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (UNSUPPORTED_CHAINS.includes(activeChainId as SUPPORTED_CHAIN_ID)) {
    return (
      <ListerOnly contract={contract}>
        <Tooltip
          label={
            chainId === activeChainId &&
            `
            Creating a listing from the dashboard isn't supported on this network. 
            You can create listings with the SDK instead. See the code tab for more info.`
          }
          hasArrow
        >
          <Flex>
            <Button
              {...restButtonProps}
              leftIcon={<Icon as={FiPlus} />}
              isDisabled
              colorScheme="primary"
            >
              New Listing
            </Button>
          </Flex>
        </Tooltip>
      </ListerOnly>
    );
  }

  return (
    <ListerOnly contract={contract}>
      <>
        <MintDrawer isOpen={isOpen} onClose={onClose} contract={contract} />
        <Button
          {...restButtonProps}
          onClick={onOpen}
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="primary"
        >
          New Listing
        </Button>
      </>
    </ListerOnly>
  );
};
