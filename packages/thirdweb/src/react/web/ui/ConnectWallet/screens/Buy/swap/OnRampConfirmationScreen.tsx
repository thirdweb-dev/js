import type { Chain } from "../../../../../../../chains/types.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { shortenString } from "../../../../../../core/utils/addresses.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { fontSize } from "../../../../design-system/index.js";
import { isNativeToken, type ERC20OrNativeToken } from "../../nativeToken.js";
import { OnRampFees } from "./Fees.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { formatSeconds } from "./formatSeconds.js";
import type { OnRampQuote } from "../../../../../../core/hooks/pay/useOnrampQuote.js";

/**
 * @internal
 */
export function OnRampConfirmationScreen(props: {
  onBack: () => void;
  quote: OnRampQuote;
  fromAmount: string;
  toAmount: string;
  // fromChain: Chain;
  toChain: Chain;
  account: Account;
  // fromToken: ERC20OrNativeToken;
  toToken: ERC20OrNativeToken;
  // onViewPendingTx: () => void;
  onQuoteFinalized: (quote: OnRampQuote) => void;
  client: ThirdwebClient;
}) {
  const toChain = useChainQuery(props.toChain);
  const toTokenSymbol = isNativeToken(props.toToken)
    ? toChain.data?.nativeCurrency?.symbol
    : props.toToken?.symbol;

  return (
    <Container p="lg">
      <ModalHeader title="Confirm Buy" onBack={props.onBack} />
      <Spacer y="lg" />

      {/* You Receive */}
      <ConfirmItem label="Receive">
        <TokenInfo
          chain={props.toChain}
          amount={String(formatNumber(Number(props.toAmount), 4))}
          symbol={toTokenSymbol || ""}
          token={props.toToken}
        />
      </ConfirmItem>

      <ConfirmItem label="Pay">
        <Text color="primaryText">${props.fromAmount}</Text>
      </ConfirmItem>

      {/* Fees  */}
      <ConfirmItem label="Fees">
        <OnRampFees quote={props.quote} align="right" />
      </ConfirmItem>

      {/* Send to  */}
      <ConfirmItem label="Send to">
        <Text color="primaryText">
          {shortenString(props.account.address, false)}
        </Text>
      </ConfirmItem>

      {/* Time  */}
      <ConfirmItem label="Time">
        <Text color="primaryText">
          ~{formatSeconds(props.quote.estimatedDurationSeconds)}
        </Text>
      </ConfirmItem>

      <Spacer y="lg" />

      <Button
        variant="accent"
        fullWidth
        disabled={status === "pending"}
        onClick={async () => {
          // TODO
        }}
        gap="xs"
      >
        Confirm
      </Button>
    </Container>
  );
}

function TokenInfo(props: {
  chain: Chain;
  token: ERC20OrNativeToken;
  amount: string;
  symbol: string;
}) {
  const chainQuery = useChainQuery(props.chain);
  return (
    <Container
      flex="column"
      gap="xxs"
      style={{
        alignItems: "flex-end",
      }}
    >
      <Container flex="row" center="y" gap="xs">
        <Text color="primaryText" size="md">
          {props.amount} {props.symbol}
        </Text>
        <TokenIcon token={props.token} chain={props.chain} size="sm" />
      </Container>

      {chainQuery.data ? (
        <Text size="sm">{chainQuery.data.name}</Text>
      ) : (
        <Skeleton width={"100px"} height={fontSize.sm} />
      )}
    </Container>
  );
}

function ConfirmItem(props: { label: string; children: React.ReactNode }) {
  return (
    <>
      <Container
        flex="row"
        gap="md"
        py="md"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="md" color="secondaryText">
          {props.label}
        </Text>
        {props.children}
      </Container>
      <Line />
    </>
  );
}
