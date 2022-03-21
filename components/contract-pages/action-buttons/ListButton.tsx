import { IContractActionButtonProps } from "./types";
import { useActiveChainId, useWeb3 } from "@3rdweb-sdk/react";
import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import { Flex, Icon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { ChainId } from "@thirdweb-dev/react";
import { MismatchButton } from "components/buttons/MismatchButton";
import { MintDrawer } from "components/shared/MintDrawer";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { SUPPORTED_CHAIN_ID } from "utils/network";

const UNSUPPORTED_CHAINS = [ChainId.Avalanche, ChainId.Fantom];

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
            <MismatchButton
              {...restButtonProps}
              leftIcon={<Icon as={FiPlus} />}
              isDisabled
            >
              New Listing
            </MismatchButton>
          </Flex>
        </Tooltip>
      </ListerOnly>
    );
  }

  return (
    <ListerOnly contract={contract}>
      <>
        <MintDrawer isOpen={isOpen} onClose={onClose} contract={contract} />
        <MismatchButton
          {...restButtonProps}
          onClick={onOpen}
          leftIcon={<Icon as={FiPlus} />}
        >
          New Listing
        </MismatchButton>
      </>
    </ListerOnly>
  );
};
