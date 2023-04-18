import { Spinner } from "../../../../components/Spinner";
import styled from "@emotion/styled";
import { useDeviceWalletInfo } from "./useDeviceWalletInfo";
import { ReconnectDeviceWallet } from "./ReconnectDeviceWallet";
import { CreateDeviceWallet } from "./CreateDeviceWallet";

export const ConnectToDeviceWallet: React.FC<{
  onBack: () => void;
  onConnected: () => void;
}> = (props) => {
  const { storageLoading, walletData, refreshSavedData } =
    useDeviceWalletInfo();

  if (storageLoading) {
    return (
      <LoadingSpinnerContainer>
        <Spinner size="lg" color="primary" />
      </LoadingSpinnerContainer>
    );
  }

  return (
    <>
      {/* <BackButton onClick={props.onBack} />
      <Spacer y="md" />
      <IconContainer>
        <Img src={meta.iconURL} width={iconSize.xl} height={iconSize.xl} />
      </IconContainer>
      <Spacer y="sm" /> */}

      {!walletData ? (
        <CreateDeviceWallet
          onConnected={props.onConnected}
          onBack={props.onBack}
        />
      ) : (
        <ReconnectDeviceWallet
          onConnected={props.onConnected}
          onRemove={() => {
            refreshSavedData();
          }}
          onBack={props.onBack}
        />
      )}
    </>
  );
};

const LoadingSpinnerContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
