"use client";
import {
  ArrowRightIcon,
  CrossCircledIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../../../core/hooks/wallets/wallet-hooks.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button, ButtonLink } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../design-system/index.js";
import type { ConnectLocale } from "../../../locale/types.js";
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
  connectLocale: ConnectLocale;
}) {
  const [selectedTx, setSelectedTx] = useState<TxStatusInfo | null>(null);

  if (selectedTx) {
    return (
      <TxDetailsScreen
        client={props.client}
        statusInfo={selectedTx}
        onBack={() => setSelectedTx(null)}
        onDone={props.onDone}
        isBuyForTx={props.isBuyForTx}
        isEmbed={props.isEmbed}
        connectLocale={props.connectLocale}
      />
    );
  }

  return <BuyTxHistoryList {...props} onSelectTx={setSelectedTx} />;
}

/**
 * @internal
 */
export function BuyTxHistoryList(props: {
  onBack?: () => void;
  client: ThirdwebClient;
  onDone: () => void;
  onSelectTx: (tx: TxStatusInfo) => void;
  connectLocale: ConnectLocale;
}) {
  const {
    pageIndex,
    setPageIndex,
    txInfosToShow,
    hidePagination,
    isLoading,
    pagination,
  } = useBuyTransactionsToShow(props.client);

  const locale = props.connectLocale;
  const activeChain = useActiveWalletChain();
  const chainQuery = useChainQuery(activeChain);
  const activeAccount = useActiveAccount();

  const noTransactions = txInfosToShow.length === 0;

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title={locale.transactions} onBack={props.onBack} />
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
              <Text> {locale.noTransactions} </Text>
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
                connectLocale={locale}
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
                {locale.prev}
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
                {locale.next}
                <ArrowRightIcon width={iconSize.sm} height={iconSize.sm} />
              </Button>
            </div>
          )}
        </Container>
      </Container>

      <Line />
      <Container p="lg" color="primaryText">
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
          {locale.viewOnExplorer}{" "}
          <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
        </ButtonLink>
      </Container>
    </Container>
  );
}
