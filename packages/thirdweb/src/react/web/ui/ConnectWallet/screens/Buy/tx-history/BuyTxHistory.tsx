"use client";
import {
  ArrowRightIcon,
  CrossCircledIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import type { UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyHistoryData } from "../../../../../../../pay/getBuyHistory.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { useBuyHistory } from "../../../../../../core/hooks/pay/useBuyHistory.js";
import { useActiveAccount } from "../../../../../hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../../hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../../../hooks/wallets/useActiveWalletChain.js";
import { LoadingScreen } from "../../../../../wallets/shared/LoadingScreen.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button, ButtonLink } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import {
  BuyTxHistoryButton,
  BuyTxHistoryButtonHeight,
} from "./BuyTxHistoryButton.js";
import { TxDetailsScreen } from "./TxDetailsScreen.js";
import {
  type TxStatusInfo,
  useBuyTransactionsToShow,
} from "./useBuyTransactionsToShow.js";

/**
 * @internal
 */
export function BuyTxHistory(props: {
  onBack?: () => void;
  client: ThirdwebClient;
  onDone: () => void;
  isBuyForTx: boolean;
  isEmbed: boolean;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedTx, setSelectedTx] = useState<TxStatusInfo | null>(null);
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();

  if (!account || !activeChain || !activeWallet) {
    return <LoadingScreen />;
  }

  if (selectedTx) {
    return (
      <TxDetailsScreen
        client={props.client}
        statusInfo={selectedTx}
        onBack={() => setSelectedTx(null)}
        onDone={props.onDone}
        isBuyForTx={props.isBuyForTx}
        isEmbed={props.isEmbed}
        activeChain={activeChain}
        activeWallet={activeWallet}
      />
    );
  }

  return (
    <BuyTxHistoryList
      {...props}
      onSelectTx={setSelectedTx}
      pageIndex={pageIndex}
      setPageIndex={setPageIndex}
      account={account}
      activeChain={activeChain}
    />
  );
}

/**
 * @internal
 */
export function BuyTxHistoryList(props: {
  onBack?: () => void;
  client: ThirdwebClient;
  onDone: () => void;
  onSelectTx: (tx: TxStatusInfo) => void;
  account: Account;
  pageIndex: number;
  setPageIndex: (index: number) => void;
  activeChain: Chain;
}) {
  const { pageIndex, setPageIndex } = props;
  const PAGE_SIZE = 10;
  const buyHistory = useBuyHistory(
    {
      walletAddress: props.account?.address,
      start: pageIndex * PAGE_SIZE,
      count: PAGE_SIZE,
      client: props.client,
    },
    {
      refetchInterval: 10 * 1000, // 10 seconds
    },
  );

  return (
    <BuyTxHistoryListUI
      {...props}
      buyHistory={buyHistory}
      pageIndex={pageIndex}
      setPageIndex={setPageIndex}
    />
  );
}

/**
 * @internal
 */
export function BuyTxHistoryListUI(props: {
  onBack?: () => void;
  client: ThirdwebClient;
  onDone: () => void;
  onSelectTx: (tx: TxStatusInfo) => void;
  buyHistory: UseQueryResult<BuyHistoryData>;
  pageIndex: number;
  setPageIndex: (index: number) => void;
  account: Account;
  activeChain: Chain;
}) {
  const { txInfosToShow, hidePagination, isLoading, pagination } =
    useBuyTransactionsToShow({
      client: props.client,
      buyHistory: props.buyHistory,
      pageIndex: props.pageIndex,
    });

  const chainQuery = useChainQuery(props.activeChain);

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
              <BuyTxHistoryButton
                key={
                  txInfo.type === "swap"
                    ? txInfo.status.source?.transactionHash
                    : txInfo.status.intentId
                }
                txInfo={txInfo}
                client={props.client}
                onClick={() => {
                  props.onSelectTx(txInfo);
                }}
              />
            );
          })}

          {isLoading && txInfosToShow.length > 0 && (
            <>
              <Skeleton width="100%" height={BuyTxHistoryButtonHeight} />
              <Skeleton width="100%" height={BuyTxHistoryButtonHeight} />
              <Skeleton width="100%" height={BuyTxHistoryButtonHeight} />
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
                disabled={props.pageIndex === 0}
                data-disabled={props.pageIndex === 0}
                style={{
                  fontSize: fontSize.sm,
                  paddingBlock: spacing.sm,
                }}
                onClick={() => {
                  props.setPageIndex(props.pageIndex - 1);
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
                  props.setPageIndex(props.pageIndex + 1);
                }}
              >
                Next
                <ArrowRightIcon width={iconSize.sm} height={iconSize.sm} />
              </Button>
            </div>
          )}
        </Container>
      </Container>

      {chainQuery.data?.explorers?.[0]?.url && (
        <>
          <Line />
          <Container p="lg">
            <ButtonLink
              fullWidth
              variant="outline"
              href={`${chainQuery.data.explorers[0].url}/address/${props.account.address}`}
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
        </>
      )}
    </Container>
  );
}
