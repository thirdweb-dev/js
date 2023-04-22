import { Spinner } from "../../../../components/Spinner";
import styled from "@emotion/styled";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { ReconnectLocalWallet } from "./ReconnectLocalWallet";
import { CreateLocalWallet } from "./CreateLocalWallet";

export const ConnectToLocalWallet: React.FC<{
  onBack: () => void;
  onConnected: () => void;
}> = (props) => {
  const { storageLoading, walletData, refreshSavedData } = useLocalWalletInfo();

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
        <CreateLocalWallet
          onConnected={props.onConnected}
          onBack={props.onBack}
        />
      ) : (
        <ReconnectLocalWallet
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
