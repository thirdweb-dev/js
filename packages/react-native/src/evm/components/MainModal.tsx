import { useModalState } from "../providers/ui-context-provider";
import { ConnectWalletFlow } from "./ConnectWalletFlow/ConnectWalletFlow";
import { Dimensions, StyleSheet, View } from "react-native";
import { useMemo } from "react";
import { CLOSE_MODAL_STATE } from "../utils/modalTypes";
import { ThemeProvider } from "../styles/ThemeProvider";
import { SessionRequestModal } from "./ConnectWalletDetails/SessionRequestModal";
import { SessionProposalModal } from "./ConnectWalletDetails/SessionProposalModal";
import { TWModal } from "./base/modal/TWModal";
import Box from "./base/Box";

const MODAL_HEIGHT = Dimensions.get("window").height * 0.6;
const DEVICE_WIDTH = Dimensions.get("window").width;

export const MainModal = () => {
  const { modalState, setModalState } = useModalState();

  const { isOpen, isSheet } = modalState;

  const view = useMemo(() => {
    switch (modalState?.view) {
      case "ConnectWalletFlow":
        return <ConnectWalletFlow />;
      // case "WalletDetails":
      //   return <ConnectWalletDetailsModal />;
      case "WalletConnectSessionRequestModal":
        return <SessionRequestModal />;
      case "WalletConnectSessionProposalModal":
        return <SessionProposalModal />;
      default:
        return null;
    }
  }, [modalState.view]);

  const onBackdropPress = () => {
    setModalState(CLOSE_MODAL_STATE("MainModal"));
  };

  return (
    <ThemeProvider>
      <TWModal isVisible={isOpen} onBackdropPress={onBackdropPress}>
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
