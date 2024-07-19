import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { isNativeTokenAddress } from "../../../../constants/addresses.js";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { toTokens } from "../../../../utils/units.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { GetWalletBalanceResult } from "../../../../wallets/utils/getWalletBalance.js";
import { CustomThemeProvider } from "../../../core/design-system/CustomThemeProvider.js";
import { type Theme, iconSize } from "../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../core/hooks/connection/ConnectButtonProps.js";
import {
  type SendTransactionConfig,
  useSendTransactionCore,
} from "../../../core/hooks/transaction/useSendTransaction.js";
import { SetRootElementContext } from "../../../core/providers/RootElementContext.js";
import type { SupportedTokens } from "../../../core/utils/defaultTokens.js";
import { AccentFailIcon } from "../../ui/ConnectWallet/icons/AccentFailIcon.js";
import { useConnectLocale } from "../../ui/ConnectWallet/locale/getConnectLocale.js";
import { LazyBuyScreen } from "../../ui/ConnectWallet/screens/Buy/LazyBuyScreen.js";
import { PayTxHistoryScreen } from "../../ui/ConnectWallet/screens/Buy/pay-transactions/BuyTxHistory.js";
import { Modal } from "../../ui/components/Modal.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Text } from "../../ui/components/text.js";
import type { LocaleId } from "../../ui/types.js";
import { LoadingScreen } from "../../wallets/shared/LoadingScreen.js";
import { useActiveWallet } from "../wallets/useActiveWallet.js";
import { useSwitchActiveWalletChain } from "../wallets/useSwitchActiveWalletChain.js";

/**
 * A hook to send a transaction.
 * @returns A mutation object to send a transaction.
 * @param config Configuration for the `useSendTransaction` hook.
 * Refer to [`SendTransactionConfig`](https://portal.thirdweb.com/references/typescript/v5/SendTransactionConfig) for more details.
 * @example
 * ```tsx
 * import { useSendTransaction } from "thirdweb/react";
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * // later
 * sendTx(tx);
 * ```
 *
 * @transaction
 */
export function useSendTransaction(config: SendTransactionConfig = {}) {
  const activeWallet = useActiveWallet();
  const switchChain = useSwitchActiveWalletChain();
  const wallet = useActiveWallet();
  const payModal = config.payModal;

  let payModalEnabled = true;

  if (payModal === false || config.gasless) {
    payModalEnabled = false;
  }

  // TODO handle erc20 pay modal
  // if active wallet is smart wallet with gasless enabled, don't show the pay modal
  if (activeWallet && activeWallet.id === "smart") {
    const options = (activeWallet as Wallet<"smart">).getConfig();

    if ("sponsorGas" in options && options.sponsorGas === true) {
      payModalEnabled = false;
    }

    if ("gasless" in options && options.gasless === true) {
      payModalEnabled = false;
    }
  }

  if (activeWallet && activeWallet.id === "inApp") {
    const options = (activeWallet as Wallet<"inApp">).getConfig();

    if (options && "smartAccount" in options && options.smartAccount) {
      const smartOptions = options.smartAccount;
      if ("sponsorGas" in smartOptions && smartOptions.sponsorGas === true) {
        payModalEnabled = false;
      }

      if ("gasless" in smartOptions && smartOptions.gasless === true) {
        payModalEnabled = false;
      }
    }
  }

  const setRootEl = useContext(SetRootElementContext);
  return useSendTransactionCore({
    showPayModal:
      !payModalEnabled || payModal === false
        ? undefined
        : (data) => {
            const prefillBuy: PayUIOptions["prefillBuy"] =
              data.currency && !isNativeTokenAddress(data.currency.address)
                ? {
                    chain: data.tx.chain,
                    amount: toTokens(data.totalCostWei, data.currency.decimals),
                    token: data.currency,
                  }
                : undefined;
            setRootEl(
              <TxModal
                title={payModal?.metadata?.title || "Buy"}
                tx={data.tx}
                onComplete={data.sendTx}
                onClose={() => {
                  setRootEl(null);
                  data.rejectTx(
                    new Error("User rejected transaction by closing modal"),
                  );
                }}
                onTxSent={data.resolveTx}
                client={data.tx.client}
                localeId={payModal?.locale || "en_US"}
                supportedTokens={payModal?.supportedTokens}
                theme={payModal?.theme || "dark"}
                txCostWei={data.totalCostWei}
                walletBalance={data.walletBalance}
                payOptions={{
                  buyWithCrypto: payModal?.buyWithCrypto,
                  buyWithFiat: payModal?.buyWithFiat,
                  purchaseData: payModal?.purchaseData,
                  prefillBuy,
                }}
              />,
            );
          },
    gasless: config.gasless,
    switchChain,
    wallet,
  });
}

type ModalProps = {
  title: string;
  onComplete: () => void;
  onClose: () => void;
  client: ThirdwebClient;
  localeId: LocaleId;
  supportedTokens?: SupportedTokens;
  theme: Theme | "light" | "dark";
  txCostWei: bigint;
  walletBalance: GetWalletBalanceResult;
  tx: PreparedTransaction;
  payOptions: PayUIOptions;
  onTxSent: (data: WaitForReceiptOptions) => void;
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
  const localeQuery = useConnectLocale(props.localeId);
  const [screen, setScreen] = useState<"buy" | "tx-history" | "execute-tx">(
    "buy",
  );

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

  if (screen === "tx-history") {
    return (
      <PayTxHistoryScreen
        title={props.title}
        client={props.client}
        onBack={() => {
          setScreen("buy");
        }}
        onDone={() => {
          setScreen("execute-tx");
        }}
        isBuyForTx={true}
        isEmbed={false}
      />
    );
  }

  return (
    <LazyBuyScreen
      title={props.title}
      isEmbed={false}
      client={props.client}
      onViewPendingTx={() => {
        setScreen("tx-history");
      }}
      supportedTokens={props.supportedTokens}
      connectLocale={localeQuery.data}
      buyForTx={{
        balance: props.walletBalance.value,
        cost: props.txCostWei,
        tx: props.tx,
        tokenSymbol: props.walletBalance.symbol,
        tokenDecimals: props.walletBalance.decimals,
      }}
      theme={typeof props.theme === "string" ? props.theme : props.theme.type}
      payOptions={props.payOptions}
      onDone={() => {
        setScreen("execute-tx");
      }}
      connectOptions={undefined}
      onBack={undefined}
    />
  );
}

function ExecutingTxScreen(props: {
  tx: PreparedTransaction;
  closeModal: () => void;
  onTxSent: (data: WaitForReceiptOptions) => void;
}) {
  const sendTxCore = useSendTransaction({
    payModal: false,
  });
  const [status, setStatus] = useState<"loading" | "failed" | "sent">(
    "loading",
  );

  const sendTx = useCallback(async () => {
    setStatus("loading");
    try {
      const txData = await sendTxCore.mutateAsync(props.tx);
      props.onTxSent(txData);
      setStatus("sent");
    } catch (e) {
      // Do not reject the transaction here, because the user may want to try again
      // we only reject on modal close
      console.error(e);
      setStatus("failed");
    }
  }, [sendTxCore, props.tx, props.onTxSent]);

  const done = useRef(false);
  useEffect(() => {
    if (done.current) {
      return;
    }

    done.current = true;
    sendTx();
  }, [sendTx]);

  return (
    <Container p="lg">
      <ModalHeader title="Transaction" />

      <Spacer y="xxl" />
      <Spacer y="xxl" />

      <Container flex="row" center="x">
        {status === "loading" && <Spinner size="3xl" color="accentText" />}
        {status === "failed" && <AccentFailIcon size={iconSize["3xl"]} />}
        {status === "sent" && (
          <Container color="success" flex="row" center="both">
            <CheckCircledIcon
              width={iconSize["3xl"]}
              height={iconSize["3xl"]}
            />
          </Container>
        )}
      </Container>
      <Spacer y="lg" />

      <Text color="primaryText" center size="lg">
        {status === "loading" && "Sending transaction"}
        {status === "failed" && "Transaction failed"}
        {status === "sent" && "Transaction sent"}
      </Text>
      <Spacer y="sm" />
      <Text color="danger" center size="sm">
        {status === "failed" && sendTxCore.error
          ? sendTxCore.error.message
          : ""}
      </Text>

      <Spacer y="xxl" />
      <Spacer y="xxl" />

      {status === "failed" && (
        <Button variant="accent" fullWidth onClick={sendTx}>
          Try Again
        </Button>
      )}

      {status === "sent" && (
        <Button variant="accent" fullWidth onClick={props.closeModal}>
          Done
        </Button>
      )}
    </Container>
  );
}
