"use client";
import styled from "@emotion/styled";
import { CheckIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useSyncExternalStore } from "react";
import { getCachedChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getTransactionStore } from "../../../../../transaction/transaction-store.js";
import { shortenHex } from "../../../../../utils/address.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { iconSize, spacing } from "../../../../core/design-system/index.js";
import { useWaitForReceipt } from "../../../../core/hooks/contract/useWaitForReceipt.js";
import {
  useChainExplorers,
  useChainIconUrl,
} from "../../../../core/hooks/others/useChainQuery.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import { ChainIcon } from "../../components/ChainIcon.js";
import { ChainName } from "../../components/ChainName.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import type { ConnectLocale } from "../locale/types.js";

export function WalletTransactionHistory(props: {
  onBack?: () => void;
  locale: ConnectLocale;
  client: ThirdwebClient;
  address: string;
}) {
  const activeChain = useActiveWalletChain();
  const chainExplorers = useChainExplorers(activeChain);
  const transactionStore = getTransactionStore(props.address);
  const reverseChronologicalTransactions = useSyncExternalStore(
    transactionStore.subscribe,
    transactionStore.getValue,
  );
  const transactions = [...reverseChronologicalTransactions].reverse();

  return (
    <Container
      scrollY
      flex="column"
      fullHeight
      style={{
        minHeight: "250px",
        maxHeight: "370px",
        paddingBottom: spacing.lg,
      }}
    >
      <Container flex="column" gap="xs" expand>
        {transactions.length === 0 ? (
          <Container
            flex="column"
            gap="md"
            center="both"
            color="secondaryText"
            style={{
              flex: "1",
              minHeight: "250px",
            }}
          >
            <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
            <Text>No Transactions</Text>
          </Container>
        ) : (
          <Container
            animate="fadein"
            flex="column"
            gap="xs"
            style={{ minHeight: "250px" }}
          >
            {transactions.map((tx) => {
              return (
                <TransactionButton
                  key={tx.transactionHash}
                  explorerUrl={chainExplorers.explorers[0]?.url}
                  client={props.client}
                  hash={tx.transactionHash}
                  chainId={tx.chainId}
                />
              );
            })}
          </Container>
        )}
      </Container>
    </Container>
  );
}

function TransactionButton(props: {
  hash: string;
  client: ThirdwebClient;
  chainId: number;
  explorerUrl?: string;
}) {
  const {
    data: receipt,
    isLoading,
    error,
  } = useWaitForReceipt({
    transactionHash: props.hash as Hex,
    chain: getCachedChain(props.chainId),
    client: props.client,
  });
  const chainIconQuery = useChainIconUrl(getCachedChain(props.chainId));

  const content = (
    <TxButton
      variant="secondary"
      fullWidth
      style={{
        paddingBlock: spacing.sm,
      }}
    >
      <Container
        flex="row"
        center="y"
        gap="md"
        style={{
          flex: 1,
        }}
      >
        <ChainIcon
          chainIconUrl={chainIconQuery.url}
          size={iconSize.lg}
          client={props.client}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Row 1 */}
          <Container
            flex="row"
            gap="xs"
            center="y"
            style={{
              justifyContent: "space-between",
            }}
          >
            <Text size="sm" color="primaryText">
              {receipt?.to
                ? `Interacted with ${shortenHex(receipt.to, 4)}`
                : `Hash: ${shortenHex(props.hash, 4)}`}
            </Text>
          </Container>

          <Spacer y="xxs" />

          {/* Row 2 */}
          <Container
            flex="row"
            center="y"
            gap="xxs"
            style={{
              justifyContent: "space-between",
            }}
          >
            <ChainName
              chain={getCachedChain(props.chainId)}
              size="xs"
              client={props.client}
            />
          </Container>
        </div>
      </Container>

      {/* Status */}
      <Container flex="row" gap="xxs" center="y">
        {isLoading && <Spinner size="sm" color="primaryText" />}
        {!isLoading && receipt && receipt.status === "success" && (
          <Text size="md" color="success">
            <CheckIcon width={iconSize.md} height={iconSize.md} />
          </Text>
        )}
        {(error || (!isLoading && receipt && receipt.status !== "success")) && (
          <Text size="md" color="danger">
            <CrossCircledIcon width={iconSize.md} height={iconSize.md} />
          </Text>
        )}
      </Container>
    </TxButton>
  );

  if (props.explorerUrl) {
    return (
      <a
        href={`${props.explorerUrl}/tx/${props.hash}`}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return content;
}

const TxButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.tertiaryBg,
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
    },
    height: "62px",
  };
});
