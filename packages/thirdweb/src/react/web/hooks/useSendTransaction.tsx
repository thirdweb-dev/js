import { useContext, useEffect, useState } from "react";
import type { ThirdwebClient } from "../../../client/client.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { useSendTransactionCore } from "../../core/hooks/contract/useSendTransaction.js";
import { SetRootElementContext } from "../../core/providers/RootElementContext.js";
import {
  type SupportedTokens,
  defaultTokens,
} from "../ui/ConnectWallet/defaultTokens.js";
import { getConnectLocale } from "../ui/ConnectWallet/locale/getConnectLocale.js";
import type { ConnectLocale } from "../ui/ConnectWallet/locale/types.js";
import { BuyScreen } from "../ui/ConnectWallet/screens/Buy/SwapScreen.js";
import { SwapTransactionsScreen } from "../ui/ConnectWallet/screens/SwapTransactionsScreen.js";
import { Modal } from "../ui/components/Modal.js";
import { CustomThemeProvider } from "../ui/design-system/CustomThemeProvider.js";
import type { Theme } from "../ui/design-system/index.js";
import type { LocaleId } from "../ui/types.js";
import { LoadingScreen } from "../wallets/shared/LoadingScreen.js";

type SendTransactionConfig = {
  buyModal?: {
    locale?: LocaleId;
    supportedTokens?: SupportedTokens;
    theme?: Theme | "light" | "dark";
  };
};

/**
 * A hook to send a transaction.
 * @returns A mutation object to send a transaction.
 * @example
 * ```jsx
 * import { useSendTransaction } from "thirdweb/react";
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * // later
 * sendTx(tx);
 * ```
 *
 * @transaction
 */
export function useSendTransaction(config?: SendTransactionConfig) {
  const setRootEl = useContext(SetRootElementContext);

  const sendTxCore = useSendTransactionCore((data) => {
    setRootEl(
      <TxModal
        tx={data.tx}
        onComplete={data.sendTx}
        onClose={() => {
          setRootEl(null);
          data.rejectTx();
        }}
        client={data.tx.client}
        localeId={config?.buyModal?.locale || "en_US"}
        supportedTokens={config?.buyModal?.supportedTokens || defaultTokens}
        theme={config?.buyModal?.theme || "dark"}
        txCostWei={data.totalCostWei}
        walletBalanceWei={data.walletBalance.value}
        nativeTokenSymbol={data.walletBalance.symbol}
      />,
    );
  });

  return sendTxCore;
}

type ModalProps = {
  onComplete: () => void;
  onClose: () => void;
  client: ThirdwebClient;
  localeId: LocaleId;
  supportedTokens: SupportedTokens;
  theme: Theme | "light" | "dark";
  txCostWei: bigint;
  walletBalanceWei: bigint;
  nativeTokenSymbol: string;
  tx: PreparedTransaction;
};

function TxModal(props: ModalProps) {
  return (
    <CustomThemeProvider theme={props.theme}>
      <Modal
        open={true}
        size="compact"
        setOpen={(_open) => {
          if (!_open) {
            props.onClose();
          }
        }}
      >
        <ModalContent {...props} />
      </Modal>
    </CustomThemeProvider>
  );
}

function ModalContent(props: ModalProps) {
  const [locale, setLocale] = useState<ConnectLocale | undefined>();
  const [screen, setScreen] = useState<"buy" | "tx-history">("buy");

  useEffect(() => {
    getConnectLocale(props.localeId).then(setLocale);
  }, [props.localeId]);

  if (!locale) {
    return <LoadingScreen />;
  }

  if (screen === "tx-history") {
    return (
      <SwapTransactionsScreen
        client={props.client}
        onBack={() => {
          props.onClose();
        }}
      />
    );
  }

  return (
    <BuyScreen
      client={props.client}
      onBack={() => {
        props.onClose();
      }}
      onViewPendingTx={() => {
        setScreen("tx-history");
      }}
      supportedTokens={props.supportedTokens}
      connectLocale={locale}
      buyForTx={{
        balance: props.walletBalanceWei,
        cost: props.txCostWei,
        tx: props.tx,
        tokenSymbol: props.nativeTokenSymbol,
      }}
    />
  );
}
