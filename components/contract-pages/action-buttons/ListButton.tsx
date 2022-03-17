import { IContractActionButtonProps } from "./types";
import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { MismatchButton } from "components/buttons/MismatchButton";
import { MintDrawer } from "components/shared/MintDrawer";
import React from "react";
import { FiPlus } from "react-icons/fi";

export interface IListButtonProps extends IContractActionButtonProps {}
export const ListButton: React.FC<IListButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
