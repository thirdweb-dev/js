import { ConfigureNetworks } from "./ConfigureNetworks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

export interface AddNetworkModalProps {
  onClose: () => void;
}

export const ConfigureNetworkModal: React.FC<AddNetworkModalProps> = (
  props,
) => {
  return (
    <Modal isOpen={true} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent
        borderRadius="xl"
        overflow="hidden"
        w="900px"
        mt={{ base: 8, md: 16 }}
        mb={{ base: 0, md: 16 }}
        maxW={{ base: "100vw", md: "calc(100vw - 40px)" }}
      >
        <ModalCloseButton />
        <ModalBody
          p={0}
          _dark={{ background: "backgroundBody" }}
          _light={{ background: "white" }}
        >
          <ConfigureNetworks
            onNetworkAdded={() => {
              // setIsNewNetworkAdded(true);
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
