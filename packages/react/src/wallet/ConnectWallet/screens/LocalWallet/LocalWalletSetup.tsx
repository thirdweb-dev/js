import { Spinner } from "../../../../components/Spinner";
import styled from "@emotion/styled";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { useEffect, useState } from "react";
import { CreateLocalWallet_Creds } from "./SetupLocalWallet_Credentials";
import { CreateLocalWallet_NoCreds } from "./SetupLocalWallet_NoCredentials";
import {
  ReconnectLocalWalletCredentials,
  ReconnectLocalWalletNoCredentials,
} from "./ReconnectLocalWallet";
import {
  UserCredentials,
  getCredentials,
  isCredentialsSupported,
} from "./credentials";

export const LocalWalletSetup: React.FC<{
  onBack: () => void;
  onConnected: () => void;
}> = (props) => {
  const { walletData } = useLocalWalletInfo();

  const [savedCreds, setSavedCreds] = useState<
    UserCredentials | null | undefined
  >();

  useEffect(() => {
    if (!isCredentialsSupported) {
      setSavedCreds(null);
      return;
    }

    getCredentials().then((cred) => {
      setSavedCreds(cred);
    });
  }, []);

  const isLoading = walletData === "loading" || savedCreds === undefined;

  if (isLoading) {
    return (
      <LoadingSpinnerContainer>
        <Spinner size="lg" color="primary" />
      </LoadingSpinnerContainer>
    );
  }

  if (isCredentialsSupported) {
    if (!savedCreds || savedCreds.name === "void") {
      return <CreateLocalWallet_Creds {...props} savedCreds={savedCreds} />;
    }

    return <ReconnectLocalWalletCredentials {...props} creds={savedCreds} />;
  }

  if (walletData) {
    return (
      <ReconnectLocalWalletNoCredentials
        onConnected={props.onConnected}
        onBack={props.onBack}
      />
    );
  }

  return <CreateLocalWallet_NoCreds {...props} />;
};

const LoadingSpinnerContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
