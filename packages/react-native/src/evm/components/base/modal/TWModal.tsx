import Modal, { ModalProps } from "react-native-modal";

const MAX_WIDTH = 500;

// Populate with the data...
export function TWModal(props: Partial<ModalProps>) {
  return (
    <Modal
      {...props}
      avoidKeyboard
      useNativeDriver
      hideModalContentWhileAnimating={true}
      style={{ maxWidth: MAX_WIDTH }}
    >
      {props.children}
    </Modal>
  );
}
