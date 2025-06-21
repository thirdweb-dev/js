import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { trackPayEvent } from "../../../../analytics/track/pay.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { resolvePromisedValue } from "../../../../utils/promise/resolve-promised-value.js";
import { CustomThemeProvider } from "../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import type { SupportedTokens } from "../../../core/utils/defaultTokens.js";
import { webWindowAdapter } from "../../adapters/WindowAdapter.js";
import { LoadingScreen } from "../../wallets/shared/LoadingScreen.js";
import { BridgeOrchestrator } from "../Bridge/BridgeOrchestrator.js";
import { useConnectLocale } from "../ConnectWallet/locale/getConnectLocale.js";
import { Modal } from "../components/Modal.js";
import type { LocaleId } from "../types.js";
import { DepositScreen } from "./DepositScreen.js";
import { ExecutingTxScreen } from "./ExecutingScreen.js";

type ModalProps = {
  title: string;
  txId: string;
  onComplete: () => void;
  onClose: () => void;
  client: ThirdwebClient;
  localeId: LocaleId;
  supportedTokens?: SupportedTokens;
  theme: Theme | "light" | "dark";
  tx: PreparedTransaction;
  payOptions: PayUIOptions;
  onTxSent: (data: WaitForReceiptOptions) => void;
  modalMode: "buy" | "deposit";
};

export function TransactionModal(props: ModalProps) {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  useQuery({
    enabled: !!wallet && !!account,
    queryFn: async () => {
      if (!account || !wallet) {
        throw new Error(); // never happens, because enabled is false
      }
      trackPayEvent({
        client: props.client,
        event:
          props.modalMode === "buy"
            ? "open_pay_transaction_modal"
            : "open_pay_deposit_modal",
        toChainId: props.tx.chain.id,
        toToken: props.tx.erc20Value
          ? (await resolvePromisedValue(props.tx.erc20Value))?.tokenAddress
          : undefined,
        walletAddress: account.address,
        walletType: wallet.id,
      });

      return null;
    },
    queryKey: ["transaction-modal-event", props.txId],
  });

  return (
    <CustomThemeProvider theme={props.theme}>
      <Modal
        open={true}
        setOpen={(_open) => {
          if (!_open) {
            props.onClose();
          }
        }}
        size="compact"
      >
        <TransactionModalContent {...props} />
      </Modal>
    </CustomThemeProvider>
  );
}

function TransactionModalContent(props: ModalProps & { onBack?: () => void }) {
  const localeQuery = useConnectLocale(props.localeId);
  const [screen, setScreen] = useState<"buy" | "execute-tx">("buy");

  if (!localeQuery.data) {
    return <LoadingScreen />;
  }

  if (screen === "execute-tx") {
    return (
      <ExecutingTxScreen
        closeModal={props.onClose}
        onTxSent={props.onTxSent}
        tx={props.tx}
        windowAdapter={webWindowAdapter}
      />
    );
  }

  if (props.modalMode === "deposit") {
    return (
      <DepositScreen
        client={props.client}
        connectLocale={localeQuery.data}
        onBack={props.onBack}
        onDone={() => {
          setScreen("execute-tx");
        }}
        tx={props.tx}
      />
    );
  }

  return (
    <BridgeOrchestrator
      client={props.client}
      connectLocale={localeQuery.data}
      connectOptions={undefined}
      onCancel={props.onClose}
      onComplete={() => {
        setScreen("execute-tx");
      }}
      onError={(_error) => {}}
      paymentLinkId={undefined}
      presetOptions={undefined}
      purchaseData={undefined}
      receiverAddress={undefined}
      uiOptions={{
        mode: "transaction",
        transaction: props.tx,
      }}
    />
  );
}
