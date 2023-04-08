import { ConfigureNetworks } from "./ConfigureNetworks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { StoredChain } from "contexts/configured-chains";

export interface AddNetworkModalProps {
  onClose: () => void;
  onNetworkAdded?: (chain: StoredChain) => void;
}

export const ConfigureNetworkModal: React.FC<AddNetworkModalProps> = (
  props,
) => {
  return (
    <Modal isOpen={true} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="xl"
        overflow="hidden"
        w="500px"
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
            onNetworkAdded={(chain) => {
              props.onNetworkAdded?.(chain);
              props.onClose();
            }}
            onNetworkConfigured={props.onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
