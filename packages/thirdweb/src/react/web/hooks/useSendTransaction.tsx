import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import type { ThirdwebClient } from "../../../client/client.js";
import { useActiveAccount } from "../../../exports/react-native.js";
import {
  type WaitForReceiptOptions,
  estimateGasCost,
} from "../../../exports/transaction.js";
import { resolvePromisedValue, toEther } from "../../../exports/utils.js";
import { getWalletBalance } from "../../../exports/wallets.js";
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
import { Modal } from "../ui/components/Modal.js";
import { Spacer } from "../ui/components/Spacer.js";
import { Container, ModalHeader } from "../ui/components/basic.js";
import { Text } from "../ui/components/text.js";
import { CustomThemeProvider } from "../ui/design-system/CustomThemeProvider.js";
import type { Theme } from "../ui/design-system/index.js";
import type { LocaleId } from "../ui/types.js";
import { LoadingScreen } from "../wallets/shared/LoadingScreen.js";

type SendTransactionConfig = {
  buyModal: {
    locale: LocaleId;
    supportedTokens: SupportedTokens;
    theme: Theme | "light" | "dark";
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
  const sendTxCore = useSendTransactionCore();
  const setRootEl = useContext(SetRootElementContext);
  const account = useActiveAccount();

  return useMutation({
    mutationFn: async (tx: PreparedTransaction) => {
      if (!account) {
        throw new Error("No active account");
      }

      const address = account.address;

      return new Promise<WaitForReceiptOptions>((resolve, reject) => {
        const sendTx = async () => {
          try {
            const res = await sendTxCore.mutateAsync(tx);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        };

        (async () => {
          try {
            const walletBalance = await getWalletBalance({
              address: address,
              chain: tx.chain,
              client: tx.client,
            });

            const txValue = await resolvePromisedValue(tx.value);
            const gasCost = await estimateGasCost({
              transaction: tx,
            });

            const totalCostWei = gasCost.wei + (txValue || 0n);
            const walletBalanceWei = walletBalance.value;

            // TODO: remove after testing
            console.debug({
              txCost: toEther(totalCostWei),
              balance: walletBalanceWei,
            });

            // if enough balance, send tx
            if (totalCostWei < walletBalanceWei) {
              sendTx();
              return;
            }

            // if not enough balance - show modal
            setRootEl(
              <TxModal
                onComplete={sendTx}
                onClose={() => {
                  setRootEl(null);
                  reject(new Error("Not enough balance"));
                }}
                client={tx.client}
                localeId={config?.buyModal.locale || "en_US"}
                supportedTokens={
                  config?.buyModal.supportedTokens || defaultTokens
                }
                theme={config?.buyModal.theme || "dark"}
                txCostWei={totalCostWei}
                walletBalanceWei={walletBalanceWei}
                nativeTokenSymbol={walletBalance.symbol}
              />,
            );
          } catch (e) {
            console.error("Failed to estimate cost", e);
            // send it anyway?
            sendTx();
          }
        })();
      });
    },
  });
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
  const [screen, setScreen] = useState<"base" | "buy">("base");

  useEffect(() => {
    getConnectLocale(props.localeId).then(setLocale);
  }, [props.localeId]);

  if (!locale) {
    return <LoadingScreen />;
  }

  if (screen === "base") {
    return (
      <Container p="lg">
        <ModalHeader title="Not enough balance" />
        <Text>
          Required: {toEther(props.txCostWei)} {props.nativeTokenSymbol}{" "}
        </Text>

        <Spacer y="lg" />

        <Text>
          Balance: {toEther(props.walletBalanceWei)} {
            props.nativeTokenSymbol
          }{" "}
        </Text>
      </Container>
    );
  }

  return (
    <BuyScreen
      client={props.client}
      onBack={() => {
        props.onClose();
      }}
      onViewPendingTx={() => {
        // TODO
      }}
      supportedTokens={props.supportedTokens}
      connectLocale={locale}
    />
  );
}
