import { Spinner } from "../../../../components/Spinner";
import styled from "@emotion/styled";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { ReconnectLocalWalletNoCredentials } from "./ReconnectLocalWallet";
import { CreateLocalWallet } from "./CreateLocalWallet";
import { UserCredentials, getCredentials } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";

export const ConnectToLocalWallet: React.FC<{
  onBack: () => void;
  onConnected: () => void;
}> = (props) => {
  const { storageLoading, walletData, refreshSavedData } = useLocalWalletInfo();

  const [savedCreds, setSavedCreds] = useState<
    UserCredentials | null | undefined
  >();

  console.log({ walletData, savedCreds });

  useEffect(() => {
    getCredentials().then((cred) => {
      setSavedCreds(cred);
    });
  }, []);

  if (storageLoading || savedCreds === undefined) {
    return (
      <LoadingSpinnerContainer>
        <Spinner size="lg" color="primary" />
      </LoadingSpinnerContainer>
    );
  }

  // if credentials supported
  // if saved creds -
  // if not saved creds -

  // if (isCredentialsSupported) {
  //   return <CreateLocalWalletCredentials {...props} />;
  // }

  return (
    <>
      {!walletData ? (
        <CreateLocalWallet
          onConnected={props.onConnected}
          onBack={props.onBack}
        />
      ) : (
        <ReconnectLocalWalletNoCredentials
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
