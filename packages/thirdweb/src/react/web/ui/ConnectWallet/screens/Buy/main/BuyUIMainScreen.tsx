import { useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { toEther } from "../../../../../../../utils/units.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import {
  fontSize,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spacer } from "../../../../components/Spacer.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import type { PayUIOptions } from "../../../ConnectButtonProps.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import { BuyTokenInput } from "../swap/BuyTokenInput.js";
import type { SupportedChainAndTokens } from "../swap/useSwapSupportedChains.js";
import type { BuyForTx, SelectedScreen } from "./types.js";
import { useBuyTxStates } from "./useBuyTxStates.js";
import { useEnabledPaymentMethods } from "./useEnabledPaymentMethods.js";

export function BuyUIMainScreen(props: {
  buyForTx: BuyForTx | null;
  client: ThirdwebClient;
  setTokenAmount: (amount: string) => void;
  account: Account | null;
  tokenAmount: string;
  payOptions: PayUIOptions;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  onSelectBuyToken: () => void;
  connectButton?: React.ReactNode;
  onViewPendingTx: () => void;
  setScreen: (screen: SelectedScreen) => void;
  supportedDestinations: SupportedChainAndTokens;
  onBack?: () => void;
}) {
  const { showPaymentSelection, buyWithCryptoEnabled, buyWithFiatEnabled } =
    useEnabledPaymentMethods({
      payOptions: props.payOptions,
      supportedDestinations: props.supportedDestinations,
      toChain: props.toChain,
      toToken: props.toToken,
    });

  const [hasEditedAmount, setHasEditedAmount] = useState(false);
  const {
    buyForTx,
    setTokenAmount,
    account,
    client,
    tokenAmount,
    payOptions,
    toToken,
    toChain,
  } = props;

  // Buy Transaction flow states
  const { amountNeeded } = useBuyTxStates({
    setTokenAmount,
    buyForTx,
    hasEditedAmount,
    account,
  });

  const disableContinue = !tokenAmount;

  return (
    <Container p="lg">
      <ModalHeader
        title={
          props.buyForTx ? `Not enough ${props.buyForTx.tokenSymbol}` : "Buy"
        }
        onBack={props.onBack}
      />

      {/* Amount needed for Send Tx */}
      {amountNeeded && props.buyForTx ? (
        <>
          <Spacer y="lg" />
          <BuyForTxUI
            amountNeeded={String(
              formatNumber(Number(toEther(amountNeeded)), 4),
            )}
            buyForTx={props.buyForTx}
            client={client}
          />
        </>
      ) : (
        <Spacer y="xl" />
      )}

      {/* To */}
      <BuyTokenInput
        value={tokenAmount}
        onChange={async (value) => {
          setHasEditedAmount(true);
          setTokenAmount(value);
        }}
        freezeAmount={payOptions.prefillBuy?.allowEdits?.amount === false}
        freezeChainAndToken={
          payOptions.prefillBuy?.allowEdits?.chain === false &&
          payOptions.prefillBuy?.allowEdits?.token === false
        }
        token={toToken}
        chain={toChain}
        onSelectToken={props.onSelectBuyToken}
        client={props.client}
        hideTokenSelector={!!props.buyForTx}
      />

      <Spacer y="xl" />

      {/* Continue */}
      <Container flex="column" gap="sm">
        {!account && props.connectButton ? (
          <div>{props.connectButton}</div>
        ) : (
          <Button
            variant="accent"
            fullWidth
            disabled={disableContinue}
            data-disabled={disableContinue}
            onClick={() => {
              if (showPaymentSelection) {
                props.setScreen({ id: "select-payment-method" });
              } else if (buyWithCryptoEnabled) {
                props.setScreen({ id: "buy-with-crypto" });
              } else if (buyWithFiatEnabled) {
                props.setScreen({ id: "buy-with-fiat" });
              } else {
                console.error("No payment method enabled");
              }
            }}
          >
            Continue
          </Button>
        )}

        {/* Do we want to remove this? */}
        {account && (
          <Button
            variant="outline"
            fullWidth
            style={{
              padding: spacing.xs,
              fontSize: fontSize.sm,
            }}
            onClick={props.onViewPendingTx}
          >
            View all transactions
          </Button>
        )}
      </Container>
    </Container>
  );
}

function BuyForTxUI(props: {
  amountNeeded: string;
  buyForTx: BuyForTx;
  client: ThirdwebClient;
}) {
  const chainQuery = useChainQuery(props.buyForTx.tx.chain);

  return (
    <Container>
      <Spacer y="xs" />
      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="sm">Amount Needed</Text>
        <Container
          flex="column"
          style={{
            alignItems: "flex-end",
          }}
        >
          <Container flex="row" gap="xs" center="y">
            <Text color="primaryText" size="sm">
              {props.amountNeeded} {props.buyForTx.tokenSymbol}
            </Text>
            <TokenIcon
              chain={props.buyForTx.tx.chain}
              client={props.client}
              size="sm"
              token={NATIVE_TOKEN}
            />
          </Container>
          <Spacer y="xxs" />
          {chainQuery.data ? (
            <Text size="sm"> {chainQuery.data.name}</Text>
          ) : (
            <Skeleton height={fontSize.sm} width="50px" />
          )}
        </Container>
      </Container>

      <Spacer y="md" />
      <Line />
      <Spacer y="md" />

      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="sm">Your Balance</Text>
        <Container flex="row" gap="xs">
          <Text color="primaryText" size="sm">
            {formatNumber(Number(toEther(props.buyForTx.balance)), 4)}{" "}
            {props.buyForTx.tokenSymbol}
          </Text>
          <TokenIcon
            chain={props.buyForTx.tx.chain}
            client={props.client}
            size="sm"
            token={NATIVE_TOKEN}
          />
        </Container>
      </Container>

      <Spacer y="md" />
      <Line />
      <Spacer y="xl" />

      <Text center size="sm">
        Purchase
      </Text>
      <Spacer y="xxs" />
    </Container>
  );
}
