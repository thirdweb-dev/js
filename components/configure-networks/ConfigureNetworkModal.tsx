import { ConfigureNetworks } from "./ConfigureNetworks";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoReload } from "react-icons/io5";
import { Button } from "tw-components";

export interface AddNetworkModalProps {
  onClose: () => void;
}

export const ConfigureNetworkModal: React.FC<AddNetworkModalProps> = (
  props,
) => {
  const [isNewNetworkAdded, setIsNewNetworkAdded] = useState(false);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [showReloadAlert, setShowReloadAlert] = useState(false);

  const handleReloadAlertClose = () => {
    if (isNewNetworkAdded) {
      // for whatever reason changing network config requires a page-reload to take effect
      window.location.reload();
    } else {
      props.onClose();
    }
  };

  const handleModalClose = () => {
    if (isNewNetworkAdded) {
      setShowReloadAlert(true);
    } else {
      props.onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={handleModalClose}>
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
              setIsNewNetworkAdded(true);
            }}
          />
        </ModalBody>
      </ModalContent>

      {/* Alert Dialog for Reload */}
      <AlertDialog
        isOpen={showReloadAlert}
        leastDestructiveRef={cancelRef}
        onClose={handleReloadAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reload required to apply network changes
            </AlertDialogHeader>

            <AlertDialogFooter>
              <Button
                colorScheme="blue"
                onClick={handleReloadAlertClose}
                ml={3}
                leftIcon={<Icon as={IoReload} />}
              >
                Reload
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Modal>
  );
};
