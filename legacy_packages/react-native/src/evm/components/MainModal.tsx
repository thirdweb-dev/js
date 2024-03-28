import {
  useGlobalTheme,
  useModalState,
} from "../providers/ui-context-provider";
import { ConnectEmbedUI } from "./ConnectWalletFlow/ConnectEmbed";
import { Dimensions, StyleSheet, View } from "react-native";
import { useMemo } from "react";
import { ThemeProvider } from "../styles/ThemeProvider";
import { SessionRequestModal } from "./ConnectWalletDetails/SessionRequestModal";
import { SessionProposalModal } from "./ConnectWalletDetails/SessionProposalModal";
import { TWModal } from "./base/modal/TWModal";
import Box from "./base/Box";
import { ConnectWalletFlowModal } from "../utils/modalTypes";

const MODAL_HEIGHT = Dimensions.get("window").height * 0.7;
const DEVICE_WIDTH = Dimensions.get("window").width;

export const MainModal = () => {
  const theme = useGlobalTheme();
  const { modalState } = useModalState();

  const { isOpen, isSheet } = modalState;

  const view = useMemo(() => {
    switch (modalState?.view) {
      case "ConnectWalletFlow":
        return (
          <ConnectEmbedUI
            {...(modalState as ConnectWalletFlowModal).data}
            isModal={true}
          />
        );
      case "WalletConnectSessionRequestModal":
        return <SessionRequestModal />;
      case "WalletConnectSessionProposalModal":
        return <SessionProposalModal />;
      default:
        return null;
    }
  }, [modalState]);

  return (
    <ThemeProvider theme={theme}>
      <TWModal isVisible={isOpen}>
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
