import Modal, { ModalProps } from "react-native-modal";

// Populate with the data...
export function TWModal(props: Partial<ModalProps>) {
  return (
    <Modal {...props} useNativeDriver hideModalContentWhileAnimating={true}>
      {props.children}
    </Modal>
  );
}
