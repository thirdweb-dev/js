import { useContext, useState } from "react";
import type { ThirdwebClient } from "../../../client/client.js";
import type { GaslessOptions } from "../../../transaction/actions/gasless/types.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import { useSendTransactionCore } from "../../core/hooks/contract/useSendTransaction.js";
import { useActiveWallet } from "../../core/hooks/wallets/wallet-hooks.js";
import { SetRootElementContext } from "../../core/providers/RootElementContext.js";
import {
  type SupportedTokens,
  defaultTokens,
} from "../ui/ConnectWallet/defaultTokens.js";
import { useConnectLocale } from "../ui/ConnectWallet/locale/getConnectLocale.js";
import { BuyScreen } from "../ui/ConnectWallet/screens/Buy/SwapScreen.js";
import { SwapTransactionsScreen } from "../ui/ConnectWallet/screens/SwapTransactionsScreen.js";
import { Modal } from "../ui/components/Modal.js";
import { CustomThemeProvider } from "../ui/design-system/CustomThemeProvider.js";
import type { Theme } from "../ui/design-system/index.js";
import type { LocaleId } from "../ui/types.js";
import { LoadingScreen } from "../wallets/shared/LoadingScreen.js";

/**
 * Configuration for the "Pay Modal" that opens when the user doesn't have enough funds to send a transaction.
 * Set `payModal: false` to disable the "Pay Modal" popup
 *
 * This configuration object includes the following properties to configure the "Pay Modal" UI:
 *
 * ### `locale`
 * The language to use for the "Pay Modal" UI. Defaults to `"en_US"`.
 *
 * ### `supportedTokens`
 * An object of type [`SupportedTokens`](https://portal.thirdweb.com/references/typescript/v5/SupportedTokens) to configure the tokens to show for a chain.
 *
 * ### `theme`
 * The theme to use for the "Pay Modal" UI. Defaults to `"dark"`.
 *
 * It can be set to `"light"` or `"dark"` or an object of type [`Theme`](https://portal.thirdweb.com/references/typescript/v5/Theme) for a custom theme.
 *
 * Refer to [`lightTheme`](https://portal.thirdweb.com/references/typescript/v5/lightTheme)
 * or [`darkTheme`](https://portal.thirdweb.com/references/typescript/v5/darkTheme) helper functions to use the default light or dark theme and customize it.
 */
export type SendTransactionPayModalConfig =
  | {
      locale?: LocaleId;
      supportedTokens?: SupportedTokens;
      theme?: Theme | "light" | "dark";
    }
  | false;

/**
 * Configuration for the `useSendTransaction` hook.
 */
export type SendTransactionConfig = {
  /**
   * Configuration for the "Pay Modal" that opens when the user doesn't have enough funds to send a transaction.
   * Set `payModal: false` to disable the "Pay Modal" popup
   *
   * This configuration object includes the following properties to configure the "Pay Modal" UI:
   *
   * ### `locale`
   * The language to use for the "Pay Modal" UI. Defaults to `"en_US"`.
   *
   * ### `supportedTokens`
   * An object of type [`SupportedTokens`](https://portal.thirdweb.com/references/typescript/v5/SupportedTokens) to configure the tokens to show for a chain.
   *
   * ### `theme`
   * The theme to use for the "Pay Modal" UI. Defaults to `"dark"`.
   *
   * It can be set to `"light"` or `"dark"` or an object of type [`Theme`](https://portal.thirdweb.com/references/typescript/v5/Theme) for a custom theme.
   *
   * Refer to [`lightTheme`](https://portal.thirdweb.com/references/typescript/v5/lightTheme)
   * or [`darkTheme`](https://portal.thirdweb.com/references/typescript/v5/darkTheme) helper functions to use the default light or dark theme and customize it.
   */
  payModal?: SendTransactionPayModalConfig;
  /**
   * Configuration for gasless transactions.
   * Refer to [`GaslessOptions`](https://portal.thirdweb.com/references/typescript/v5/GaslessOptions) for more details.
   */
  gasless?: GaslessOptions;
};

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
  const payModal = config.payModal;

  let payModalEnabled = true;

  if (payModal === false || config.gasless) {
    payModalEnabled = false;
  }

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

  const setRootEl = useContext(SetRootElementContext);
  return useSendTransactionCore(
    !payModalEnabled || payModal === false
      ? undefined
      : (data) => {
          setRootEl(
            <TxModal
              tx={data.tx}
              onComplete={data.sendTx}
              onClose={() => {
                setRootEl(null);
                data.rejectTx();
              }}
              client={data.tx.client}
              localeId={payModal?.locale || "en_US"}
              supportedTokens={payModal?.supportedTokens || defaultTokens}
              theme={payModal?.theme || "dark"}
              txCostWei={data.totalCostWei}
              walletBalanceWei={data.walletBalance.value}
              nativeTokenSymbol={data.walletBalance.symbol}
            />,
          );
        },
    config.gasless,
  );
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
  const localeQuery = useConnectLocale(props.localeId);
  const [screen, setScreen] = useState<"buy" | "tx-history">("buy");

  if (!localeQuery.data) {
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
      connectLocale={localeQuery.data}
      buyForTx={{
        balance: props.walletBalanceWei,
        cost: props.txCostWei,
        tx: props.tx,
        tokenSymbol: props.nativeTokenSymbol,
      }}
    />
  );
}
