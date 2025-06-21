"use client";
import styled from "@emotion/styled";
import { CheckIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { getCachedChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  getPastTransactions,
  getTransactionStore,
  type StoredTransaction,
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
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { ChainIcon } from "../../components/ChainIcon.js";
import { ChainName } from "../../components/ChainName.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
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
    enabled: !!activeChain,
    queryFn: () =>
      getPastTransactions({
        chain: activeChain || ethereum,
        client: props.client,
        walletAddress: props.address,
      }),
    queryKey: ["transactions", props.address, activeChain],
  });
  const transactions = [
    ...[...reverseChronologicalTransactions].reverse(),
    ...(historicalTxQuery.data || []),
  ];
  return (
    <Container
      flex="column"
      fullHeight
      scrollY
      style={{
        maxHeight: "370px",
        minHeight: "250px",
        paddingBottom: spacing.lg,
      }}
    >
      <Container expand flex="column" gap="xs">
        {historicalTxQuery.isLoading && (
          <Container
            center="both"
            color="secondaryText"
            flex="column"
            gap="md"
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
            center="both"
            color="secondaryText"
            flex="column"
            gap="md"
            style={{
              flex: "1",
              minHeight: "250px",
            }}
          >
            <CrossCircledIcon height={iconSize.xl} width={iconSize.xl} />
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
                  client={props.client}
                  explorerUrl={chainExplorers.explorers[0]?.url}
                  key={tx.transactionHash}
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
    chain: getCachedChain(props.tx.chainId),
    client: props.client,
    queryOptions: {
      enabled: props.tx.receipt === undefined,
    },
    transactionHash: props.tx.transactionHash,
  });
  const chainIconQuery = useChainIconUrl(getCachedChain(props.tx.chainId));
  const receipt = props.tx.receipt ?? fetchedReceipt;

  const content = (
    <TxButton
      fullWidth
      style={{
        paddingBlock: spacing.sm,
      }}
      variant="secondary"
    >
      <Container
        center="y"
        flex="row"
        gap="md"
        style={{
          flex: 1,
        }}
      >
        <ChainIcon
          chainIconUrl={chainIconQuery.url}
          client={props.client}
          size={iconSize.lg}
        />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Row 1 */}
          <Container
            center="y"
            flex="row"
            gap="xs"
            style={{
              justifyContent: "space-between",
            }}
          >
            <Text color="primaryText" size="sm">
              {receipt?.to
                ? `Interacted with ${shortenHex(receipt?.to, 4)}`
                : `Hash: ${shortenHex(props.tx.transactionHash, 4)}`}
            </Text>
          </Container>

          <Spacer y="xxs" />

          {/* Row 2 */}
          <Container
            center="y"
            flex="row"
            gap="xxs"
            style={{
              justifyContent: "space-between",
            }}
          >
            <ChainName
              chain={getCachedChain(props.tx.chainId)}
              client={props.client}
              size="xs"
            />
          </Container>
        </div>
      </Container>

      {/* Status */}
      <Container center="y" flex="row" gap="xxs">
        {isLoading && <Spinner color="primaryText" size="sm" />}
        {!isLoading && receipt && receipt.status === "success" && (
          <Text color="success" size="md">
            <CheckIcon height={iconSize.md} width={iconSize.md} />
          </Text>
        )}
        {(error || (!isLoading && receipt && receipt.status !== "success")) && (
          <Text color="danger" size="md">
            <CrossCircledIcon height={iconSize.md} width={iconSize.md} />
          </Text>
        )}
      </Container>
    </TxButton>
  );

  if (props.explorerUrl) {
    return (
      <a
        href={formatExplorerTxUrl(props.explorerUrl, props.tx.transactionHash)}
        rel="noreferrer"
        target="_blank"
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
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
    },
    background: theme.colors.tertiaryBg,
    height: "62px",
  };
});
