import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { MintForm } from "components/contract-pages/forms/mint";

interface IMintDrawer {
  contract?: ValidContractInstance;
  isOpen: boolean;
  onClose: () => void;
}

export const MintDrawer: React.FC<IMintDrawer> = ({
  isOpen,
  onClose,
  contract,
}) => {
  return (
    <Drawer
      allowPinchZoom
      preserveScrollBarGap
      size="lg"
      onClose={onClose}
      isOpen={isOpen}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <MintForm contract={contract} />
      </DrawerContent>
    </Drawer>
  );
};
