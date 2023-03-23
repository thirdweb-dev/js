import { useAppTheme } from "../../../styles/hooks";
import { PropsWithChildren } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Modal, { ModalProps } from "react-native-modal";

const MODAL_HEIGHT = Dimensions.get("window").height * 0.7;
const DEVICE_WIDTH = Dimensions.get("window").width;

export type TWModalProps = PropsWithChildren<
  Pick<ModalProps, "isVisible"> &
    Pick<Partial<ModalProps>, "onBackButtonPress" | "onBackdropPress">
>;

// Populate with the data...
export function TWModal({ children, isVisible, ...props }: TWModalProps) {
  const theme = useAppTheme();

  return (
    <Modal useNativeDriver isVisible={isVisible} {...props}>
      <View
        style={[styles.modal, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.contentContainer}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: DEVICE_WIDTH,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  contentContainer: {
    maxHeight: MODAL_HEIGHT,
    display: "flex",
  },
});
