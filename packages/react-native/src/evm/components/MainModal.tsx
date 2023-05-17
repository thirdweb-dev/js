import Modal from "react-native-modal";
import { useModalState } from "../providers/ui-context-provider";
import { ConnectWalletFlow } from "./ConnectWalletFlow/ConnectWalletFlow";
import { ThemeProvider } from "../styles/ThemeProvider";

export const MainModal = () => {
  const { modalState } = useModalState();

  return (
    <ThemeProvider>
      <Modal isVisible={modalState.isOpen}>
        {modalState?.view === "ConnectWalletFlow" && <ConnectWalletFlow />}
      </Modal>
    </ThemeProvider>
  );
};
