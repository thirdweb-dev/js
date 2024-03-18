import { useMemo, useState, useSyncExternalStore } from "react";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Spacer } from "../../components/Spacer.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../design-system/index.js";
import { StyledAnchor, StyledDiv } from "../../design-system/elements.js";
import { useCustomTheme } from "../../design-system/CustomThemeProvider.js";
import { Text } from "../../components/text.js";
import { ArrowRightIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { fadeInAnimation } from "../../design-system/animations.js";
import { Spinner } from "../../components/Spinner.js";
import { Button } from "../../components/buttons.js";
import { useChainQuery } from "../../../../core/hooks/others/useChainQuery.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../core/hooks/wallets/wallet-hooks.js";
import { useBuyWithCryptoHistory } from "../../../../core/hooks/pay/useBuyWithCryptoHistory.js";
import { BuyIcon } from "../icons/BuyIcon.js";
import { CryptoIcon } from "../icons/CryptoIcon.js";
import { Skeleton } from "../../components/Skeleton.js";
import type { BuyWithCryptoStatuses } from "../../../../../pay/buyWithCrypto/actions/getStatus.js";
import { defineChain } from "../../../../../chains/utils.js";
import { swapTransactionsStore } from "./Buy/swap/pendingSwapTx.js";

type TxStatusInfo = {
  fromChainId: number;
  transactionHash: string;
  sourceTokenAmount: string;
  sourceTokenSymbol: string;
  status: BuyWithCryptoStatuses;
};

const PAGE_SIZE = 10;

/**
 * @internal
 */
export function SwapTransactionsScreen(props: { onBack: () => void }) {
  const [pageIndex, setPageIndex] = useState(0);
  const _historyQuery = useSwapTransactions(pageIndex);

  const swapTxs = useSyncExternalStore(
    swapTransactionsStore.subscribe,
    swapTransactionsStore.getValue,
  );

  const inMemoryPendingTxs = swapTxs.filter((tx) => tx.status === "PENDING");

  const txInfosToShow: TxStatusInfo[] = [];

  const txHashSet = new Set<string>();
  _historyQuery.data?.page.forEach((tx) => {
    txHashSet.add(tx.source.transactionHash);
  });

  // add in-memory pending transactions
  inMemoryPendingTxs.forEach((tx) => {
    // if tx is already in history endpoint, don't add it
    if (txHashSet.has(tx.transactionHash)) {
      return;
    }

    txInfosToShow.push({
      fromChainId: tx.from.chainId,
      transactionHash: tx.transactionHash,
      sourceTokenAmount: tx.from.value,
      sourceTokenSymbol: tx.from.symbol,
      status: "PENDING",
    });
  });

  // Add data from endpoint
  _historyQuery.data?.page.forEach((tx) => {
    txInfosToShow.push({
      fromChainId: tx.source.token.chainId,
      transactionHash: tx.source.transactionHash,
      sourceTokenAmount: tx.quote.fromAmount,
      sourceTokenSymbol: tx.source.token.symbol || "",
      status: tx.status,
    });
  });

  const activeChain = useActiveWalletChain();
  const chainQuery = useChainQuery(activeChain);
  const activeAccount = useActiveAccount();

  const noTransactions = txInfosToShow.length === 0;

  const hidePagination =
    !_historyQuery.data ||
    (_historyQuery.data && !_historyQuery.data.hasNextPage && pageIndex === 0);

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Transactions" onBack={props.onBack} />
      </Container>

      <Container
        flex="column"
        gap="sm"
        px="md"
        scrollY
        style={{
          minHeight: "250px",
          maxHeight: "370px",
        }}
      >
        {noTransactions && !_historyQuery.isLoading && (
          <Container
            flex="column"
            gap="md"
            center="both"
            color="secondaryText"
            style={{
              minHeight: "250px",
            }}
          >
            <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
            <Text> No Transactions </Text>
          </Container>
        )}

        {noTransactions && _historyQuery.isLoading && (
          <Container
            flex="row"
            center="both"
            style={{
              minHeight: "250px",
            }}
          >
            <Spinner size="xl" color="accentText" />
          </Container>
        )}

        {txInfosToShow.map((txInfo, i) => {
          return <TransactionInfo key={i} txInfo={txInfo} />;
        })}

        {_historyQuery.data && !hidePagination && (
          <>
            <Spacer y="lg" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: spacing.sm,
              }}
            >
              <Button
                variant="outline"
                gap="xs"
                disabled={pageIndex === 0}
                data-disabled={pageIndex === 0}
                style={{
                  fontSize: fontSize.sm,
                  paddingBlock: spacing.sm,
                }}
                onClick={() => {
                  setPageIndex((prev) => prev - 1);
                }}
              >
                <ArrowRightIcon
                  width={iconSize.sm}
                  height={iconSize.sm}
                  style={{
                    transform: "rotate(180deg)",
                  }}
                />
                Prev
              </Button>
              <Button
                variant="outline"
                gap="xs"
                disabled={!_historyQuery.data.hasNextPage}
                data-disabled={!_historyQuery.data.hasNextPage}
                style={{
                  fontSize: fontSize.sm,
                  paddingBlock: spacing.sm,
                }}
                onClick={() => {
                  setPageIndex((prev) => prev + 1);
                }}
              >
                Next
                <ArrowRightIcon width={iconSize.sm} height={iconSize.sm} />
              </Button>
            </div>
            <Spacer y="xs" />
          </>
        )}
      </Container>

      <Line />
      <Container p="lg">
        <ButtonLink
          fullWidth
          variant="accent"
          href={
            chainQuery.data?.explorers?.[0]?.url +
            "/address/" +
            activeAccount?.address
          }
          target="_blank"
          as="a"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          View on Explorer
        </ButtonLink>
      </Container>
    </Container>
  );
}

/**
 * @internal
 */
export function useSwapTransactions(pageIndex: number) {
  const account = useActiveAccount();
  const historyQuery = useBuyWithCryptoHistory(
    {
      walletAddress: account?.address || "",
      start: pageIndex * PAGE_SIZE,
      count: PAGE_SIZE,
    },
    {
      // 30 seconds
      refetchInterval: 30 * 1000,
    },
  );

  return historyQuery;
}

function TransactionInfo(props: { txInfo: TxStatusInfo }) {
  const {
    fromChainId,
    transactionHash,
    sourceTokenAmount,
    sourceTokenSymbol,
    status,
  } = props.txInfo;

  const fromChain = useMemo(() => defineChain(fromChainId), [fromChainId]);

  const chainQuery = useChainQuery(fromChain);

  return (
    <TxHashLink
      href={`${chainQuery.data?.explorers?.[0]?.url || ""}/tx/${transactionHash}`}
      target="_blank"
    >
      <Container flex="row" center="y" gap="md">
        <IconBox data-box>
          <BuyIcon size={iconSize.sm} />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              transform: "translate(30%, 30%)",
            }}
          >
            <CryptoIcon size={iconSize.sm} />
          </div>
        </IconBox>
        <div
          style={{
            flex: 1,
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
            <Text color="primaryText"> Buy</Text>
            <Text size="sm" color="primaryText">
              + {Number(sourceTokenAmount).toFixed(3)} {sourceTokenSymbol}
            </Text>{" "}
          </Container>

          <Spacer y="xs" />

          {/* Row 2 */}
          <Container
            flex="row"
            center="y"
            gap="xxs"
            style={{
              justifyContent: "space-between",
            }}
          >
            {/* Status */}
            <Container flex="row" gap="xxs" center="y">
              <Text
                size="sm"
                color={
                  status === "PENDING"
                    ? "accentText"
                    : status === "COMPLETED"
                      ? "success"
                      : "danger"
                }
              >
                {status === "COMPLETED"
                  ? "Completed"
                  : status === "PENDING"
                    ? "Pending"
                    : "Failed"}
              </Text>
              {status === "PENDING" && <Spinner size="xs" color="accentText" />}
            </Container>

            {/* Network */}
            {chainQuery.data?.name ? (
              <Text size="sm"> {chainQuery.data.name}</Text>
            ) : (
              <Skeleton width="120px" height={fontSize.sm} />
            )}
          </Container>
        </div>
      </Container>
    </TxHashLink>
  );
}

const ButtonLink = /* @__PURE__ */ (() => Button.withComponent("a"))();

const IconBox = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.secondaryText,
    padding: spacing.sm,
    border: `2px solid ${theme.colors.borderColor}`,
    borderRadius: radius.lg,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  };
});

const TxHashLink = /* @__PURE__ */ StyledAnchor(() => {
  const theme = useCustomTheme();
  return {
    padding: spacing.sm,
    borderRadius: radius.lg,
    cursor: "pointer",
    animation: `${fadeInAnimation} 300ms ease`,
    background: theme.colors.walletSelectorButtonHoverBg,
    "&:hover": {
      transition: "background 250ms ease",
      background: theme.colors.secondaryButtonBg,
    },
    height: "68px",
  };
});
