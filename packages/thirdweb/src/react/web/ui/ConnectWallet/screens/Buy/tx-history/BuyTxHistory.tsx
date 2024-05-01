import {
  ArrowRightIcon,
  CrossCircledIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { type UseQueryOptions, useQueries } from "@tanstack/react-query";
import { useState, useSyncExternalStore } from "react";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import {
  type BuyWithCryptoStatus,
  getBuyWithCryptoStatus,
  getBuyWithFiatStatus,
} from "../../../../../../../exports/pay.js";
import { useBuyHistory } from "../../../../../../../exports/react.js";
import type { ValidBuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../../../core/hooks/wallets/wallet-hooks.js";
import { ChainName } from "../../../../components/ChainName.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { fadeInAnimation } from "../../../../design-system/animations.js";
import { StyledButton } from "../../../../design-system/elements.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../design-system/index.js";
import { pendingTransactions } from "../swap/pendingSwapTx.js";
import { FiatDetailsScreen } from "./FiatDetailsScreen.js";
import { SwapDetailsScreen } from "./SwapDetailsScreen.js";
import {
  getBuyWithCryptoStatusMeta,
  getBuyWithFiatStatusMeta,
} from "./statusMeta.js";

type TxStatusInfo =
  | {
      type: "swap";
      status: BuyWithCryptoStatus;
    }
  | {
      type: "fiat";
      status: ValidBuyWithFiatStatus;
    };

const PAGE_SIZE = 10;

function useBuyTransactionsToShow(client: ThirdwebClient) {
  const account = useActiveAccount();
  const [pageIndex, setPageIndex] = useState(0);
  const txStatusList: TxStatusInfo[] = [];

  const buyHistory = useBuyHistory(
    {
      walletAddress: account?.address || "",
      start: pageIndex * PAGE_SIZE,
      count: PAGE_SIZE,
      client,
    },
    {
      refetchInterval: 10 * 1000, // 10 seconds
    },
  );

  const pendingTxStoreValue = useSyncExternalStore(
    pendingTransactions.subscribe,
    pendingTransactions.getValue,
  );

  const pendingStatusQueries = useQueries<
    UseQueryOptions<TxStatusInfo | null>[]
  >({
    queries: pendingTxStoreValue.map((tx) => {
      return {
        queryKey: ["pending-tx-status", tx],
        queryFn: async () => {
          if (tx.type === "swap") {
            const swapStatus = await getBuyWithCryptoStatus({
              client: client,
              transactionHash: tx.txHash,
            });

            return {
              type: "swap",
              status: swapStatus,
            };
          }

          const fiatStatus = await getBuyWithFiatStatus({
            client: client,
            intentId: tx.intentId,
          });

          if (fiatStatus.status === "NOT_FOUND") {
            return null;
          }

          return {
            type: "fiat",
            status: fiatStatus,
          };
        },
        refetchInterval: 10 * 1000, // 10 seconds
      };
    }),
  });

  if (pendingStatusQueries.length > 0 && pageIndex === 0) {
    for (const query of pendingStatusQueries) {
      if (query.data) {
        const txStatusInfo = query.data;

        // if already present - don't add it
        if (buyHistory.data) {
          if (txStatusInfo.type === "swap") {
            const isPresent = buyHistory.data.page.find((tx) => {
              if ("buyWithCryptoStatus" in tx) {
                return (
                  tx.buyWithCryptoStatus.source.transactionHash ===
                  txStatusInfo.status.source.transactionHash
                );
              }
              return false;
            });

            if (!isPresent) {
              txStatusList.push(txStatusInfo);
            }
          }

          if (txStatusInfo.type === "fiat") {
            const isPresent = buyHistory.data.page.find((tx) => {
              if (
                "buyWithFiatStatus" in tx &&
                tx.buyWithFiatStatus.status !== "NOT_FOUND"
              ) {
                return (
                  tx.buyWithFiatStatus.intentId === txStatusInfo.status.intentId
                );
              }
              return false;
            });

            if (!isPresent) {
              txStatusList.push(txStatusInfo);
            }
          }
        } else {
          // if no history - add without duplicate check
          txStatusList.push(txStatusInfo);
        }
      }
    }
  }

  if (buyHistory.data) {
    for (const tx of buyHistory.data.page) {
      if ("buyWithCryptoStatus" in tx) {
        txStatusList.push({
          type: "swap",
          status: tx.buyWithCryptoStatus,
        });
      } else {
        if (tx.buyWithFiatStatus.status !== "NOT_FOUND") {
          txStatusList.push({
            type: "fiat",
            status: tx.buyWithFiatStatus,
          });
        }
      }
    }
  }

  const hidePagination =
    !buyHistory.data ||
    (buyHistory.data && !buyHistory.data.hasNextPage && pageIndex === 0);

  return {
    pageIndex,
    setPageIndex,
    txInfosToShow: txStatusList,
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
  onBack?: () => void;
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

  const [selectedTx, setSelectedTx] = useState<TxStatusInfo | null>(null);

  if (selectedTx) {
    if (selectedTx.type === "swap") {
      return (
        <SwapDetailsScreen
          client={props.client}
          status={selectedTx.status}
          onBack={() => {
            setSelectedTx(null);
          }}
        />
      );
    }

    if (selectedTx.type === "fiat") {
      return (
        <FiatDetailsScreen
          client={props.client}
          status={selectedTx.status}
          onBack={() => {
            setSelectedTx(null);
          }}
        />
      );
    }

    return null;
  }

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
                key={
                  txInfo.type === "swap"
                    ? txInfo.status.source.transactionHash
                    : txInfo.status.intentId
                }
                txInfo={txInfo}
                client={props.client}
                onClick={() => {
                  setSelectedTx(txInfo);
                }}
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
          variant="outline"
          href={`${chainQuery.data?.explorers?.[0]?.url}/address/${activeAccount?.address}`}
          target="_blank"
          as="a"
          gap="xs"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          View on Explorer{" "}
          <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
        </ButtonLink>
      </Container>
    </Container>
  );
}

function TransactionInfo(props: {
  txInfo: TxStatusInfo;
  client: ThirdwebClient;
  onClick?: () => void;
}) {
  const statusMeta =
    props.txInfo.type === "swap"
      ? getBuyWithCryptoStatusMeta(props.txInfo.status)
      : getBuyWithFiatStatusMeta(props.txInfo.status);

  return (
    <TXPreviewButton onClick={props.onClick}>
      <Container
        flex="row"
        center="y"
        gap="sm"
        style={{
          flex: 1,
        }}
      >
        <TokenIcon
          client={props.client}
          chain={defineChain(props.txInfo.status.quote.toToken.chainId)}
          size="md"
          token={{
            address: props.txInfo.status.quote.toToken.tokenAddress,
          }}
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
              +{" "}
              {formatNumber(
                Number(
                  props.txInfo.type === "swap"
                    ? props.txInfo.status.quote.toAmount
                    : props.txInfo.status.quote.estimatedToTokenAmount,
                ),
                4,
              )}{" "}
              {props.txInfo.status.quote.toToken.symbol}
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
            <ChainName
              chain={defineChain(props.txInfo.status.quote.toToken.chainId)}
              size="xs"
              client={props.client}
            />
          </Container>
        </div>
      </Container>

      {/* Status */}
      <Container flex="row" gap="xxs" center="y">
        <Text size="xs" color={statusMeta.color}>
          {statusMeta.status}
        </Text>
      </Container>
    </TXPreviewButton>
  );
}

const ButtonLink = /* @__PURE__ */ (() => Button.withComponent("a"))();

const TXPreviewButton = /* @__PURE__ */ StyledButton(() => {
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
