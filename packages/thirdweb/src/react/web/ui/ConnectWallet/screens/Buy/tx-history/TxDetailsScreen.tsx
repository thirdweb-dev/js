import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { Wallet } from "../../../../../../../wallets/interfaces/wallet.js";
import { FiatDetailsScreen } from "./FiatDetailsScreen.js";
import { SwapDetailsScreen } from "./SwapDetailsScreen.js";
import type { TxStatusInfo } from "./useBuyTransactionsToShow.js";

export function TxDetailsScreen(props: {
  client: ThirdwebClient;
  statusInfo: TxStatusInfo;
  onBack: () => void;
  onDone: () => void;
  isEmbed: boolean;
  activeChain: Chain;
  activeWallet: Wallet;
}) {
  const { statusInfo } = props;

  if (statusInfo.type === "swap") {
    return (
      <SwapDetailsScreen
        client={props.client}
        status={statusInfo.status}
        onBack={props.onBack}
      />
    );
  }

  if (statusInfo.type === "fiat") {
    return (
      <FiatDetailsScreen
        client={props.client}
        status={statusInfo.status}
        onBack={props.onBack}
        onDone={props.onDone}
        isEmbed={props.isEmbed}
        activeChain={props.activeChain}
        activeWallet={props.activeWallet}
      />
    );
  }

  return null;
}
