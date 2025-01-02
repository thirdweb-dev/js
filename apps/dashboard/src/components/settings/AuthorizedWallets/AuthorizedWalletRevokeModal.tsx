import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Button } from "tw-components";

type AuthorizedWalletRevokeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (authorizedWalletId: string) => void;
  authorizedWalletId: string;
};

export const AuthorizedWalletRevokeModal: React.FC<
  AuthorizedWalletRevokeModalProps
> = ({ isOpen, onClose, onSubmit, authorizedWalletId }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Are you sure you want to revoke this device?</ModalHeader>
        <ModalCloseButton />

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(authorizedWalletId)}
            variant="outline"
            colorScheme="red"
          >
            Revoke
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
