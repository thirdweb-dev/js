import { ArrowRightIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useMemo, useState, useSyncExternalStore } from "react";
import { defineChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { BuyWithFiatStatus } from "../../../../../exports/pay.js";
import { useBuyHistory } from "../../../../../exports/react.js";
import type {
  BuyWithCryptoStatus,
  BuyWithCryptoStatuses,
  BuyWithCryptoSubStatuses,
} from "../../../../../pay/buyWithCrypto/actions/getStatus.js";
import { formatNumber } from "../../../../../utils/formatNumber.js";
import { useChainQuery } from "../../../../core/hooks/others/useChainQuery.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../core/hooks/wallets/wallet-hooks.js";
import { ChainIcon } from "../../components/ChainIcon.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import { useCustomTheme } from "../../design-system/CustomThemeProvider.js";
import { fadeInAnimation } from "../../design-system/animations.js";
import { StyledAnchor } from "../../design-system/elements.js";
import {
  type Theme,
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../design-system/index.js";
import { swapTransactionsStore } from "./Buy/swap/pendingSwapTx.js";

type TxStatusInfo =
  | {
      type: "buyWithCrypto";
      boughtChainId: number;
      transactionHash: string;
      boughtTokenAmount: string;
      boughtTokenSymbol: string;
      status: BuyWithCryptoStatus["status"];
      subStatus?: BuyWithCryptoStatus["subStatus"];
    }
  | {
      type: "buyWithFiat";
      boughtChainId: number;
      transactionHash: string;
      boughtTokenAmount: string;
      boughtTokenSymbol: string;
      status: BuyWithFiatStatus["status"];
    };

// Note: Do not use useConnectUI here

const PAGE_SIZE = 10;

function useBuyTransactionsToShow(client: ThirdwebClient) {
  const [pageIndex, setPageIndex] = useState(0);
  const txInfosToShow: TxStatusInfo[] = [];
  const account = useActiveAccount();
  const buyHistory = useBuyHistory(
    {
      walletAddress: account?.address || "",
      start: pageIndex * PAGE_SIZE,
      count: PAGE_SIZE,
      client,
    },
    {
      refetchInterval: 30 * 1000, // 30 seconds
    },
  );

  const inMemoryPendingTxs = useSyncExternalStore(
    swapTransactionsStore.subscribe,
    swapTransactionsStore.getValue,
  );

  // create txHash
  const txHashSet = new Set<string>();
  for (const tx of buyHistory.data?.page || []) {
    if ("buyWithCryptoStatus" in tx) {
      txHashSet.add(tx.buyWithCryptoStatus.source.transactionHash);
    } else {
      if (tx.buyWithFiatStatus.status !== "NOT_FOUND") {
        txHashSet.add(tx.buyWithFiatStatus.source.transactionHash);
      }
    }
  }

  // add in-memory pending transactions
  for (const tx of inMemoryPendingTxs) {
    if (pageIndex > 0) {
      continue;
    }

    // if tx is already in history endpoint, don't add it
    if (txHashSet.has(tx.transactionHash)) {
      continue;
    }

    txInfosToShow.push({
      type: "buyWithCrypto",
      boughtChainId: tx.destination.chainId,
      transactionHash: tx.transactionHash,
      boughtTokenAmount: tx.destination.value,
      boughtTokenSymbol: tx.destination.symbol,
      status: "PENDING",
    });
  }

  // Add data from endpoint
  for (const tx of buyHistory.data?.page || []) {
    if ("buyWithCryptoStatus" in tx) {
      const txInfo = tx.buyWithCryptoStatus;
      txInfosToShow.push({
        type: "buyWithCrypto",
        boughtChainId:
          txInfo.destination?.token.chainId || txInfo.quote.toToken.chainId,
        transactionHash: txInfo.source.transactionHash,
        boughtTokenAmount: txInfo.destination?.amount || txInfo.quote.toAmount,
        boughtTokenSymbol:
          txInfo.destination?.token.symbol || txInfo.quote.toToken.symbol || "",
        status: txInfo.status,
        subStatus: txInfo.subStatus,
      });
    } else {
      const txInfo = tx.buyWithFiatStatus;
      if (txInfo.status !== "NOT_FOUND") {
        console.log("fiat status", txInfo);
        txInfosToShow.push({
          type: "buyWithFiat",
          boughtChainId: txInfo.quote.toToken.chainId,
          transactionHash: txInfo.source.transactionHash,
          boughtTokenAmount: txInfo.quote.estimatedToTokenAmount,
          boughtTokenSymbol: txInfo.quote.toToken.symbol,
          status: txInfo.status,
        });
      }
    }
  }

  const hidePagination =
    !buyHistory.data ||
    (buyHistory.data && !buyHistory.data.hasNextPage && pageIndex === 0);

  return {
    pageIndex,
    setPageIndex,
    txInfosToShow,
    hidePagination,
    isLoading: buyHistory.isLoading,
    pagination: buyHistory.data
      ? {
          hasNextPage: buyHistory.data.hasNextPage,
        }
      : undefined,
  };
}

/**
 * @internal
 */
export function BuyTxHistory(props: {
  onBack: () => void;
  client: ThirdwebClient;
}) {
  const {
    pageIndex,
    setPageIndex,
    txInfosToShow,
    hidePagination,
    isLoading,
    pagination,
  } = useBuyTransactionsToShow(props.client);

  const activeChain = useActiveWalletChain();
  const chainQuery = useChainQuery(activeChain);
  const activeAccount = useActiveAccount();

  const noTransactions = txInfosToShow.length === 0;

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Transactions" onBack={props.onBack} />
      </Container>

      <Container
        scrollY
        flex="column"
        fullHeight
        style={{
          minHeight: "250px",
          maxHeight: "370px",
        }}
      >
        <Container flex="column" gap="xs" px="lg" expand>
          {noTransactions && !isLoading && (
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

          {noTransactions && isLoading && (
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

          {txInfosToShow.map((txInfo) => {
            return (
              <TransactionInfo
                key={txInfo.transactionHash}
                txInfo={txInfo}
                client={props.client}
              />
            );
          })}

          {isLoading && txInfosToShow.length > 0 && (
            <>
              <Skeleton width="100%" height="68px" />
              <Skeleton width="100%" height="68px" />
              <Skeleton width="100%" height="68px" />
            </>
          )}
        </Container>

        <Container p="lg">
          {pagination && !hidePagination && (
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
                disabled={!pagination.hasNextPage}
                data-disabled={!pagination.hasNextPage}
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
          )}
        </Container>
      </Container>

      <Line />
      <Container p="lg">
        <ButtonLink
          fullWidth
          variant="accent"
          href={`${chainQuery.data?.explorers?.[0]?.url}/address/${activeAccount?.address}`}
          target="_blank"
          as="a"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          View all transactions
        </ButtonLink>
      </Container>
    </Container>
  );
}

function TransactionInfo(props: {
  txInfo: TxStatusInfo;
  client: ThirdwebClient;
}) {
  const {
    boughtChainId,
    transactionHash,
    boughtTokenAmount,
    boughtTokenSymbol,
  } = props.txInfo;

  const boughtChain = useMemo(
    () => defineChain(boughtChainId),
    [boughtChainId],
  );

  const chainQuery = useChainQuery(boughtChain);
  const statusMeta =
    props.txInfo.type === "buyWithCrypto"
      ? getBuyWithCryptoStatusMeta(props.txInfo.status, props.txInfo.subStatus)
      : getBuyWithFiatStatusMeta(props.txInfo.status);

  const isValidTxHash = transactionHash.startsWith("0x");
  return (
    <TxHashLink
      href={`${
        chainQuery.data?.explorers?.[0]?.url || ""
      }/tx/${transactionHash}`}
      as={isValidTxHash ? "a" : "button"}
      target="_blank"
    >
      <Container
        flex="row"
        center="y"
        gap="sm"
        style={{
          flex: 1,
        }}
      >
        <ChainIcon
          client={props.client}
          size={iconSize.md}
          chain={chainQuery.data}
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
              + {formatNumber(Number(boughtTokenAmount), 4)} {boughtTokenSymbol}
            </Text>{" "}
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
            {/* Network */}
            {chainQuery.data?.name ? (
              <Text size="sm"> {chainQuery.data.name}</Text>
            ) : (
              <Skeleton width="120px" height={fontSize.sm} />
            )}
          </Container>
        </div>
      </Container>

      {/* Status */}
      <Container flex="row" gap="xxs" center="y">
        <Text size="xs" color={statusMeta.color}>
          {statusMeta.status}
        </Text>
      </Container>
    </TxHashLink>
  );
}

const ButtonLink = /* @__PURE__ */ (() => Button.withComponent("a"))();

const TxHashLink = /* @__PURE__ */ StyledAnchor(() => {
  const theme = useCustomTheme();
  return {
    border: "none",
    padding: spacing.sm,
    borderRadius: radius.lg,
    cursor: "pointer",
    animation: `${fadeInAnimation} 300ms ease`,
    background: theme.colors.tertiaryBg,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      transition: "background 250ms ease",
      background: theme.colors.secondaryButtonBg,
    },
    height: "68px",
  };
});

type StatusMeta = {
  status: string;
  color: keyof Theme["colors"];
  loading?: true;
};

function getBuyWithCryptoStatusMeta(
  status: BuyWithCryptoStatuses,
  subStatus?: BuyWithCryptoSubStatuses,
): StatusMeta {
  if (subStatus === "WAITING_BRIDGE") {
    return {
      status: "Bridging",
      color: "accentText",
      loading: true,
    };
  }

  if (subStatus === "PARTIAL_SUCCESS") {
    return {
      status: "Incomplete",
      color: "secondaryText",
    };
  }

  if (status === "PENDING") {
    return {
      status: "Pending",
      color: "accentText",
      loading: true,
    };
  }

  if (status === "FAILED") {
    return {
      status: "Failed",
      color: "danger",
    };
  }

  if (status === "COMPLETED") {
    return {
      status: "Completed",
      color: "success",
    };
  }

  return {
    status: "Unknown",
    color: "secondaryText",
  };
}

// TODO: get proper copy from Design/Product and confirm what these statuses mean

function getBuyWithFiatStatusMeta(
  status: BuyWithFiatStatus["status"],
): StatusMeta {
  // TEMP fix - this needs to be fixed in server
  if ((status as string) === "CRYPTO_SWAP_REQUIRED ") {
    return {
      status: "Incomplete",
      color: "accentText",
    };
  }

  switch (status) {
    case "CRYPTO_SWAP_IN_PROGRESS":
    case "PENDING_ON_RAMP_TRANSFER":
    case "ON_RAMP_TRANSFER_IN_PROGRESS":
    case "PENDING_PAYMENT":
    case "PENDING_CRYPTO_SWAP": {
      return {
        status: "Pending",
        color: "accentText",
        loading: true,
      };
    }

    case "ON_RAMP_TRANSFER_COMPLETED":
    case "CRYPTO_SWAP_COMPLETED": {
      return {
        status: "Completed", // Is this actually completed though?
        color: "success",
        loading: true,
      };
    }

    case "CRYPTO_SWAP_FAILED":
    case "CRYPTO_SWAP_REQUIRED": {
      return {
        status: "Incomplete",
        color: "accentText",
      };
    }

    case "PAYMENT_FAILED":
    case "ON_RAMP_TRANSFER_FAILED": {
      return {
        status: "Failed",
        color: "danger",
      };
    }
  }

  return {
    status: "Unknown",
    color: "secondaryText",
  };
}
