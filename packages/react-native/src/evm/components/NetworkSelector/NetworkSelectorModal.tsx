import { ModalHeaderTextClose } from "../base/modal/ModalHeaderTextClose";
import { TWModal, TWModalProps } from "../base/modal/TWModal";

export type NetworkSelectorModalProps = {
  onClose: () => void;
} & TWModalProps;

export const NetworkSelectorModal = ({
  isVisible,
  onClose,
  ...props
}: NetworkSelectorModalProps) => {
  return (
    <TWModal isVisible={isVisible} {...props}>
      <ModalHeaderTextClose
        headerText={"Select Network"}
        subHeaderText={"Choose a new network to connect to thirdweb"}
        onClose={onClose}
      />
    </TWModal>
  );
};
