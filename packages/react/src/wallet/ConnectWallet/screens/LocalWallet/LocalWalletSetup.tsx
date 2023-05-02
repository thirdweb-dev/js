import { Spinner } from "../../../../components/Spinner";
import styled from "@emotion/styled";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import {
  CreateLocalWallet_Guest,
  CreateLocalWallet_Password,
} from "./CreateLocalWallet";
import { ReconnectLocalWallet } from "./ReconnectLocalWallet";
import { WalletInfo } from "../../../types";
import { walletIds } from "@thirdweb-dev/wallets";
import { LocalWalletObj } from "../../../wallets/localWallet";

export const LocalWalletSetup: React.FC<{
  onBack: () => void;
  onConnected: () => void;
  walletsInfo: WalletInfo[];
}> = (props) => {
  const { walletData } = useLocalWalletInfo(props.walletsInfo);

  const localWalletInfo = props.walletsInfo.find(
    (w) => w.wallet.id === walletIds.localWallet,
  ) as WalletInfo;
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
        walletsInfo={props.walletsInfo}
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
