import { ModalHeaderTextClose } from "../base/modal/ModalHeaderTextClose";

export type NetworkSelectorModalProps = {
  onClose: () => void;
};

export const NetworkSelectorModal = ({
  onClose,
}: NetworkSelectorModalProps) => {
  return (
    <ModalHeaderTextClose
      headerText={"Select Network"}
      subHeaderText={"Choose a new network to connect to thirdweb"}
      onClose={onClose}
    />
  );
};
