import { Spinner } from "../../../../components/Spinner";
import styled from "@emotion/styled";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import {
  CreateLocalWallet_Guest,
  CreateLocalWallet_Password,
} from "./CreateLocalWallet";
import { ReconnectLocalWallet } from "./ReconnectLocalWallet";
import { LocalWalletObj } from "../../../wallets/localWallet";
import { useWalletInfo } from "../../walletInfo";

export const LocalWalletSetup: React.FC<{
  onBack: () => void;
  onConnected: () => void;
}> = (props) => {
  const { walletData } = useLocalWalletInfo();

  const localWalletInfo = useWalletInfo("localWallet", true);

  const wallet = localWalletInfo.wallet as LocalWalletObj;

  if (!wallet.config.persist) {
    return <CreateLocalWallet_Guest {...props} />;
  }

  if (walletData === "loading") {
    return (
      <LoadingSpinnerContainer>
        <Spinner size="lg" color="primary" />
      </LoadingSpinnerContainer>
    );
  }

  if (walletData) {
    return (
      <ReconnectLocalWallet
        onConnected={props.onConnected}
        onBack={props.onBack}
      />
    );
  }

  return <CreateLocalWallet_Password {...props} />;
};

const LoadingSpinnerContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
