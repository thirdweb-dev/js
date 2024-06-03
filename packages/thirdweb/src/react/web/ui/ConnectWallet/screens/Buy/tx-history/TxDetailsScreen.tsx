import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { ConnectLocale } from "../../../locale/types.js";
import { FiatDetailsScreen } from "./FiatDetailsScreen.js";
import { SwapDetailsScreen } from "./SwapDetailsScreen.js";
import type { TxStatusInfo } from "./useBuyTransactionsToShow.js";

export function TxDetailsScreen(props: {
  client: ThirdwebClient;
  statusInfo: TxStatusInfo;
  onBack: () => void;
  onDone: () => void;
  isBuyForTx: boolean;
  isEmbed: boolean;
  connectLocale: ConnectLocale;
}) {
  const { statusInfo } = props;

  if (statusInfo.type === "swap") {
    return (
      <SwapDetailsScreen
        client={props.client}
        status={statusInfo.status}
        onBack={props.onBack}
        connectLocale={props.connectLocale}
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
        isBuyForTx={props.isBuyForTx}
        isEmbed={props.isEmbed}
        connectLocale={props.connectLocale}
      />
    );
  }

  return null;
}
