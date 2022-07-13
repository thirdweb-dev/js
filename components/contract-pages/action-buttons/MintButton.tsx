import { IContractActionButtonProps } from "./types";
import { MinterOnly } from "@3rdweb-sdk/react";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { EditionDrop, NFTDrop, SignatureDrop } from "@thirdweb-dev/sdk";
import { MintDrawer } from "components/shared/MintDrawer";
import React, { useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "tw-components";

export interface IMintButtonProps extends IContractActionButtonProps {}
export const MintButton: React.FC<IMintButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const mintButtonText = useMemo(() => {
    return contract instanceof NFTDrop ||
      contract instanceof EditionDrop ||
      contract instanceof SignatureDrop
      ? "Create"
      : "Mint";
  }, [contract]);

  return (
    <MinterOnly contract={contract}>
      <>
        <MintDrawer isOpen={isOpen} onClose={onClose} contract={contract} />
        <Button
          {...restButtonProps}
          onClick={onOpen}
          leftIcon={<Icon as={FiPlus} />}
        >
          {mintButtonText}
        </Button>
      </>
    </MinterOnly>
  );
};
