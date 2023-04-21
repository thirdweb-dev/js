import { Spinner } from "../../../../components/Spinner";
import styled from "@emotion/styled";
import { useDeviceWalletInfo } from "./useDeviceWalletInfo";
import { ReconnectDeviceWalletNoCredentials } from "./ReconnectDeviceWallet";
import { CreateDeviceWallet } from "./CreateDeviceWallet";
import { UserCredentials, getCredentials } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";

export const ConnectToDeviceWallet: React.FC<{
  onBack: () => void;
  onConnected: () => void;
}> = (props) => {
  const { storageLoading, walletData, refreshSavedData } =
    useDeviceWalletInfo();

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
  //   return <CreateDeviceWalletCredentials {...props} />;
  // }

  return (
    <>
      {!walletData ? (
        <CreateDeviceWallet
          onConnected={props.onConnected}
          onBack={props.onBack}
        />
      ) : (
        <ReconnectDeviceWalletNoCredentials
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
