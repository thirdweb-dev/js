import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { trackPayEvent } from "../../../../analytics/track.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { CustomThemeProvider } from "../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import type { SupportedTokens } from "../../../core/utils/defaultTokens.js";
import { LoadingScreen } from "../../wallets/shared/LoadingScreen.js";
import { useConnectLocale } from "../ConnectWallet/locale/getConnectLocale.js";
import { LazyBuyScreen } from "../ConnectWallet/screens/Buy/LazyBuyScreen.js";
import { Modal } from "../components/Modal.js";
import type { LocaleId } from "../types.js";
import { ExecutingTxScreen } from "./ExecutingScreen.js";

export type ModalProps = {
  title: string;
  onComplete: () => void;
  onClose: () => void;
  client: ThirdwebClient;
  localeId: LocaleId;
  supportedTokens?: SupportedTokens;
  theme: Theme | "light" | "dark";
  tx: PreparedTransaction;
  payOptions: PayUIOptions;
  onTxSent: (data: WaitForReceiptOptions) => void;
};

export function TransactionModal(props: ModalProps) {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  useQuery({
    queryKey: ["transaction-modal-event"],
    queryFn: () => {
      if (!account || !wallet) return;
      trackPayEvent({
        client: props.client,
        walletAddress: account.address,
        walletType: wallet.id,
        event: "open_pay_transaction_modal",
      });
    },
    enabled: !!wallet,
  });

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
        <TransactionModalContent {...props} />
      </Modal>
    </CustomThemeProvider>
  );
}

export function TransactionModalContent(
  props: ModalProps & { onBack?: () => void },
) {
  const localeQuery = useConnectLocale(props.localeId);
  const [screen, setScreen] = useState<"buy" | "execute-tx">("buy");

  if (!localeQuery.data) {
    return <LoadingScreen />;
  }

  if (screen === "execute-tx") {
    return (
      <ExecutingTxScreen
        tx={props.tx}
        closeModal={props.onClose}
        onTxSent={props.onTxSent}
      />
    );
  }

  return (
    <LazyBuyScreen
      title={props.title}
      isEmbed={false}
      client={props.client}
      onBack={props.onBack}
      supportedTokens={props.supportedTokens}
      connectLocale={localeQuery.data}
      theme={typeof props.theme === "string" ? props.theme : props.theme.type}
      payOptions={props.payOptions}
      onDone={() => {
        setScreen("execute-tx");
      }}
      connectOptions={undefined}
    />
  );
}
