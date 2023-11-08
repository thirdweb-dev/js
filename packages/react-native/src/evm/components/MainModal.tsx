import {
  useGlobalTheme,
  useModalState,
} from "../providers/ui-context-provider";
import { ConnectWalletFlow } from "./ConnectWalletFlow/ConnectWalletFlow";
import { Dimensions, StyleSheet, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "../styles/ThemeProvider";
import { SessionRequestModal } from "./ConnectWalletDetails/SessionRequestModal";
import { SessionProposalModal } from "./ConnectWalletDetails/SessionProposalModal";
import { TWModal } from "./base/modal/TWModal";
import Box from "./base/Box";
import { ModalState } from "../utils/modalTypes";

const MODAL_HEIGHT = Dimensions.get("window").height * 0.7;
const DEVICE_WIDTH = Dimensions.get("window").width;

type State = "closed" | "opened" | "pending";

export const MainModal = () => {
  const theme = useGlobalTheme();
  const [state, setState] = useState<State>("closed");
  const { modalState } = useModalState();

  const { isOpen, isSheet } = modalState;

  const onModalHide = () => {
    setLocalModalState(modalState);
    setIsModalVisible(false);
  };

  useEffect(() => {
    switch (state) {
      case "opened":
        setState(isOpen ? "pending" : "closed");
        break;
      case "closed":
        setState(isOpen ? "opened" : "closed");
        break;
    }
    if (isModalVisible) {
      if (isOpen) {
        /**
         * 1. if the modal is open and the new state is open
         *    then we need to close the modal first
         *    see: https://github.com/react-native-modal/react-native-modal#i-cant-show-multiple-modals-one-after-another
         *
         * 2. if the new state is not open then we need to close the modal as well
         */
        setIsModalVisible(false);
      }
    } else {
      setIsModalVisible(isOpen);
      setLocalModalState(modalState);
    }
  }, [isModalVisible, isOpen, modalState]);

  console.log("MainModal", modalState);

  const view = useMemo(() => {
    switch (modalState?.view) {
      case "ConnectWalletFlow":
        return <ConnectWalletFlow />;
      case "WalletConnectSessionRequestModal":
        return <SessionRequestModal />;
      case "WalletConnectSessionProposalModal":
        return <SessionProposalModal />;
      default:
        return null;
    }
  }, [modalState.view]);

  return (
    <ThemeProvider theme={theme}>
      <TWModal isVisible={state === "opened"} onModalHide={onModalHide}>
        {isSheet ? (
          <Box backgroundColor="background" style={styles.modal}>
            <View style={styles.contentContainer}>{view}</View>
          </Box>
        ) : (
          view
        )}
      </TWModal>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: DEVICE_WIDTH,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingBottom: 28,
  },
  contentContainer: {
    maxHeight: MODAL_HEIGHT,
    display: "flex",
  },
});
