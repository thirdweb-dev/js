import { useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import type { PayerInfo } from "../types.js";
import { SwapStatusScreen } from "./SwapStatusScreen.js";
import { TransferConfirmationScreen } from "./TransferConfirmationScreen.js";

type TrasnferFlowProps = {
  title: string;
  onBack?: () => void;
  payer: PayerInfo;
  receiverAddress: string;
  client: ThirdwebClient;
  onDone: () => void;
  onTryAgain: () => void;
  isEmbed: boolean;
  onSuccess: ((status: BuyWithCryptoStatus) => void) | undefined;
  chain: Chain;
  token: ERC20OrNativeToken;
  tokenAmount: string;
  transactionMode?: boolean;
};

export function TransferFlow(props: TrasnferFlowProps) {
  const [transferTxHash, setTransferTxHash] = useState<string | undefined>();

  if (transferTxHash) {
    return (
      <SwapStatusScreen
        title={props.title}
        onBack={props.onBack}
        onTryAgain={props.onTryAgain}
        swapTxHash={transferTxHash}
        client={props.client}
        onDone={props.onDone}
        transactionMode={false}
        isEmbed={props.isEmbed}
        quote={undefined}
        onSuccess={props.onSuccess}
      />
    );
  }

  return (
    <TransferConfirmationScreen
      {...props}
      setTransactionHash={setTransferTxHash}
    />
  );
}
