import { RNCamera } from "react-native-camera";
import { TWModal } from "../base/modal/TWModal";
import { ModalHeaderTextClose } from "../base/modal/ModalHeaderTextClose";

export const QRCodeScan = ({
  isVisible,
  onQRCodeScan,
  onClose,
}: {
  isVisible: boolean;
  onQRCodeScan: (data: string) => void;
  onClose: () => void;
}) => {
  return (
    <TWModal isVisible={isVisible} backdropOpacity={0.7}>
      <ModalHeaderTextClose headerText={"Scan to Connect"} onClose={onClose} />
      <RNCamera
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: "Permission to use camera",
          message: "We need your permission to use your camera",
          buttonPositive: "Ok",
          buttonNegative: "Cancel",
        }}
        onBarCodeRead={({ data }) => {
          onQRCodeScan(data);
        }}
      />
    </TWModal>
  );
};
