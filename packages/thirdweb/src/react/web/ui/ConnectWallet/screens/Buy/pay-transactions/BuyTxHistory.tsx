"use client";
import { ArrowRightIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import {
  BuyTxHistoryButton,
  BuyTxHistoryButtonHeight,
} from "./BuyTxHistoryButton.js";
import {
  type TxStatusInfo,
  useBuyTransactionsToShow,
} from "./useBuyTransactionsToShow.js";

/**
 * @internal
 */
export function PayTxHistoryList(props: {
  client: ThirdwebClient;
  onSelectTx: (tx: TxStatusInfo) => void;
}) {
  const {
    pageIndex,
    setPageIndex,
    txInfosToShow,
    hidePagination,
    isLoading,
    pagination,
  } = useBuyTransactionsToShow(props.client);

  const noTransactions = txInfosToShow.length === 0;

  return (
    <Container
      scrollY
      flex="column"
      fullHeight
      style={{
        width: "100%",
        minHeight: "250px",
        maxHeight: "370px",
        paddingBottom: spacing.lg,
      }}
    >
      <Container flex="column" gap="xs" expand>
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
            <Text>No Transactions</Text>
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

        {txInfosToShow.length > 0 && (
          <Container animate="fadein" flex="column" gap="xs">
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
          </Container>
        )}

        {isLoading && txInfosToShow.length > 0 && (
          <>
            <Skeleton width="100%" height={BuyTxHistoryButtonHeight} />
            <Skeleton width="100%" height={BuyTxHistoryButtonHeight} />
            <Skeleton width="100%" height={BuyTxHistoryButtonHeight} />
          </>
        )}
      </Container>

      {pagination && !hidePagination && (
        <Container py="md">
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
        </Container>
      )}
    </Container>
  );
}
