import type { ThirdwebClient } from "../../../../../../../client/client.js";
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
        isBuyForTx={props.isBuyForTx}
        isEmbed={props.isEmbed}
      />
    );
  }

  return null;
}
