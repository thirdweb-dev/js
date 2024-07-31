/* eslint-disable i18next/no-literal-string */
import { CrossCircledIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import {
  useBuyWithCryptoHistory,
  type BuyWithCryptoStatus,
  useAddress,
  useWalletContext,
  useChainId,
} from "@thirdweb-dev/react-core";
import { useState, useSyncExternalStore } from "react";
import { Skeleton } from "../../../components/Skeleton";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, ModalHeader, Line } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { iconSize, spacing, fontSize, radius } from "../../../design-system";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";
import { fadeInAnimation } from "../../../design-system/animations";
import { StyledDiv, StyledAnchor } from "../../../design-system/elements";
import { useChainQuery } from "../../hooks/useChainQuery";
import { formatNumber } from "../../utils/formatNumber";
import { swapTransactionsStore } from "./Buy/swap/pendingSwapTx";
import { BuyIcon } from "../icons/BuyIcon";
import { Text } from "../../../components/text";
import { CryptoIcon } from "../icons/CryptoIcon";

type ValidBuyWithCryptoStatus = Exclude<
  BuyWithCryptoStatus,
  { status: "NOT_FOUND" }
>;

type TxStatusInfo = {
  boughChainId: number;
  transactionHash: string;
  boughtTokenAmount: string;
  boughtTokenSymbol: string;
  status: ValidBuyWithCryptoStatus["status"];
  subStatus?: ValidBuyWithCryptoStatus["subStatus"];
};

const PAGE_SIZE = 10;

/**
 * @internal
 */
export function SwapTransactionsScreen(props: { onBack: () => void }) {
  const [pageIndex, setPageIndex] = useState(0);
  const _historyQuery = useSwapTransactions(pageIndex);

  const inMemoryPendingTxs = useSyncExternalStore(
    swapTransactionsStore.subscribe,
    swapTransactionsStore.getValue,
  );

  const txInfosToShow: TxStatusInfo[] = [];

  const txHashSet = new Set<string>();
  // TODO: why is the annotation required here?
  _historyQuery.data?.page.forEach((tx: BuyWithCryptoStatus) => {
    if (tx.status !== "NOT_FOUND" && tx.status !== "NONE") {
      if (tx.source?.transactionHash) {
        txHashSet.add(tx.source?.transactionHash);
      }
    }
  });

  // add in-memory pending transactions
  inMemoryPendingTxs.forEach((tx) => {
    if (pageIndex > 0) {
      return;
    }

    // if tx is already in history endpoint, don't add it
    if (txHashSet.has(tx.transactionHash)) {
      return;
    }

    txInfosToShow.push({
      boughChainId: tx.destination.chainId,
      transactionHash: tx.transactionHash,
      boughtTokenAmount: tx.destination.value,
      boughtTokenSymbol: tx.destination.symbol,
      status: "PENDING",
    });
  });

  // Add data from endpoint
  // TODO: why is the annotation required here?
  _historyQuery.data?.page.forEach((tx: BuyWithCryptoStatus) => {
    if (tx.status !== "NOT_FOUND" && tx.status !== "NONE") {
      if (tx.source?.transactionHash) {
        txInfosToShow.push({
          boughChainId:
            tx.destination?.token.chainId || tx.quote.toToken.chainId,
          transactionHash: tx.source?.transactionHash,
          boughtTokenAmount: tx.destination?.amount || tx.quote.toAmount,
          boughtTokenSymbol:
            tx.destination?.token.symbol || tx.quote.toToken.symbol || "",
          status: tx.status,
          subStatus: tx.subStatus,
        });
      }
    }
  });

  const activeChainId = useChainId();
  const chainQuery = useChainQuery(activeChainId);
  const address = useAddress();

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
        scrollY
        flex="column"
        fullHeight
        style={{
          minHeight: "250px",
          maxHeight: "370px",
        }}
      >
        <Container flex="column" gap="sm" px="lg" expand>
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

          {txInfosToShow.map((txInfo) => {
            return (
              <TransactionInfo key={txInfo.transactionHash} txInfo={txInfo} />
            );
          })}

          {_historyQuery.isLoading && txInfosToShow.length > 0 && (
            <>
              <Skeleton width="100%" height="68px" />
              <Skeleton width="100%" height="68px" />
              <Skeleton width="100%" height="68px" />
            </>
          )}
        </Container>

        <Container p="lg">
          {_historyQuery.data && !hidePagination && (
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
          )}
        </Container>
      </Container>

      <Line />
      <Container p="lg">
        <ButtonLink
          fullWidth
          variant="accent"
          href={chainQuery.data?.explorers?.[0]?.url + "/address/" + address}
          target="_blank"
          // as="a"
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
function useSwapTransactions(pageIndex: number) {
  const { clientId } = useWalletContext();
  const address = useAddress();

  const historyQuery = useBuyWithCryptoHistory(
    {
      walletAddress: address || "",
      start: pageIndex * PAGE_SIZE,
      count: PAGE_SIZE,
      clientId,
    },
    {
      refetchInterval: 30 * 1000,
    },
  );

  return historyQuery;
}

function TransactionInfo(props: { txInfo: TxStatusInfo }) {
  const {
    boughChainId,
    transactionHash,
    boughtTokenAmount,
    boughtTokenSymbol,
    status,
  } = props.txInfo;

  const chainQuery = useChainQuery(boughChainId);
  const statusMeta = getStatusMeta(status, props.txInfo.subStatus);

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
              + {formatNumber(Number(boughtTokenAmount), 4)} {boughtTokenSymbol}
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
              <Text size="sm" color={statusMeta.color}>
                {statusMeta.status}
              </Text>
              {statusMeta.loading && <Spinner size="xs" color="accentText" />}
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IconBox = /* @__PURE__ */ StyledDiv((_) => {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TxHashLink = /* @__PURE__ */ StyledAnchor((_) => {
  const theme = useCustomTheme();
  return {
    unset: "all",
    padding: spacing.sm,
    borderRadius: radius.lg,
    cursor: "pointer",
    animation: `${fadeInAnimation} 300ms ease`,
    background: theme.colors.walletSelectorButtonHoverBg,
    "&:hover": {
      textDecoration: "none",
      transition: "background 250ms ease",
      background: theme.colors.secondaryButtonBg,
    },
    height: "68px",
  };
});

function getStatusMeta(
  status: ValidBuyWithCryptoStatus["status"],
  subStatus?: ValidBuyWithCryptoStatus["subStatus"],
) {
  if (subStatus === "WAITING_BRIDGE") {
    return {
      status: "Bridging",
      color: "accentText",
      loading: true,
    } as const;
  }

  if (subStatus === "PARTIAL_SUCCESS") {
    return {
      status: "Incomplete",
      color: "secondaryText",
      loading: false,
    } as const;
  }

  if (status === "PENDING") {
    return {
      status: "Pending",
      color: "accentText",
      loading: true,
    } as const;
  }

  if (status === "FAILED") {
    return {
      status: "Failed",
      color: "danger",
      loading: false,
    } as const;
  }

  if (status === "COMPLETED") {
    return {
      status: "Completed",
      color: "success",
      loading: false,
    } as const;
  }

  return {
    status: "Unknown",
    color: "secondaryText",
  } as const;
}
