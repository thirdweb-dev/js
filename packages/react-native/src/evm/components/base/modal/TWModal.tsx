import Modal, { ModalProps } from "react-native-modal";

const MAX_WIDTH = 500;

// Populate with the data...
/**
 * @internal
 */
export function TWModal(props: Partial<ModalProps>) {
  return (
    <Modal
      {...props}
      avoidKeyboard
      useNativeDriver
      hideModalContentWhileAnimating={true}
      style={{ maxWidth: MAX_WIDTH }}
      animationIn="slideInUp" // Slide in from bottom
      animationOut="slideOutDown" // Slide out to bottom
    >
      {props.children}
    </Modal>
  );
}
