"use client";
import styled from "@emotion/styled";
import { CheckIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { getCachedChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  type StoredTransaction,
  getPastTransactions,
  getTransactionStore,
} from "../../../../../transaction/transaction-store.js";
import { shortenHex } from "../../../../../utils/address.js";
import { formatExplorerTxUrl } from "../../../../../utils/url.js";
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
  const historicalTxQuery = useQuery({
    queryKey: ["transactions", props.address, activeChain],
    queryFn: () =>
      getPastTransactions({
        walletAddress: props.address,
        chain: activeChain || ethereum,
        client: props.client,
      }),
    enabled: !!activeChain,
  });
  const transactions = [
    ...[...reverseChronologicalTransactions].reverse(),
    ...(historicalTxQuery.data || []),
  ];
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
        {historicalTxQuery.isLoading && (
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
            <Spinner color={"secondaryText"} size={"md"} />
            <Text>Loading recent transactions...</Text>
          </Container>
        )}
        {!historicalTxQuery.isLoading && transactions.length === 0 ? (
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
                  tx={tx}
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
  tx: StoredTransaction;
  client: ThirdwebClient;
  explorerUrl?: string;
}) {
  const {
    data: fetchedReceipt,
    isLoading,
    error,
  } = useWaitForReceipt({
    transactionHash: props.tx.transactionHash,
    chain: getCachedChain(props.tx.chainId),
    client: props.client,
    queryOptions: {
      enabled: props.tx.receipt === undefined,
    },
  });
  const chainIconQuery = useChainIconUrl(getCachedChain(props.tx.chainId));
  const receipt = props.tx.receipt ?? fetchedReceipt;

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
                ? `Interacted with ${shortenHex(receipt?.to, 4)}`
                : `Hash: ${shortenHex(props.tx.transactionHash, 4)}`}
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
              chain={getCachedChain(props.tx.chainId)}
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
        href={formatExplorerTxUrl(props.explorerUrl, props.tx.transactionHash)}
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
