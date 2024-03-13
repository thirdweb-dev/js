import { useSyncExternalStore } from "react";
import { Container, ModalHeader } from "../../components/basic.js";
import { swapTransactionsStore } from "./Buy/swap/pendingSwapTx.js";
import { Spacer } from "../../components/Spacer.js";
import { ArrowTopBottom } from "../icons/ArrowTopBottom.js";
import { iconSize, radius, spacing } from "../../design-system/index.js";
import { StyledAnchor, StyledDiv } from "../../design-system/elements.js";
import { useCustomTheme } from "../../design-system/CustomThemeProvider.js";
import { Text } from "../../components/text.js";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { fadeInAnimation } from "../../design-system/animations.js";
import { Spinner } from "../../components/Spinner.js";
import { formatNumber } from "../../../utils/formatNumber.js";

/**
 * @internal
 */
export function SwapTransactionsScreen(props: { onBack: () => void }) {
  const swapTxs = useSyncExternalStore(
    swapTransactionsStore.subscribe,
    swapTransactionsStore.getValue,
  );

  const reversedTxs = [...swapTxs].reverse();
  return (
    <Container
      style={{
        minHeight: "350px",
      }}
      animate="fadein"
    >
      <Container p="lg">
        <ModalHeader title="Transactions" onBack={props.onBack} />
      </Container>

      <Spacer y="xs" />

      <Container flex="column" gap="md" px="md">
        {reversedTxs.map((txInfo, i) => {
          return (
            <TxHashLink key={i} href={txInfo.txExplorerLink} target="_blank">
              <Container flex="row" center="y" gap="sm">
                <IconBox>
                  <ArrowTopBottom size={iconSize.md} />
                </IconBox>
                <div>
                  <Container flex="row" gap="xs" center="y">
                    <Text color="primaryText"> Swap</Text>

                    <Text
                      size="sm"
                      color={
                        txInfo.status === "PENDING"
                          ? "accentText"
                          : txInfo.status === "COMPLETED"
                            ? "success"
                            : "danger"
                      }
                    >
                      {txInfo.status === "COMPLETED"
                        ? "Completed"
                        : txInfo.status === "PENDING"
                          ? "Pending"
                          : "Failed"}
                    </Text>

                    {txInfo.status === "PENDING" && (
                      <Spinner size="xs" color="accentText" />
                    )}
                  </Container>

                  <Spacer y="xs" />

                  <Container flex="row" center="y" gap="xxs">
                    <Text size="sm">
                      {Number(txInfo.from.value).toFixed(3)}{" "}
                      {txInfo.from.symbol}
                    </Text>{" "}
                    <Container color="primaryText" flex="row" center="both">
                      <ArrowRightIcon
                        width={iconSize.xs}
                        height={iconSize.xs}
                      />
                    </Container>{" "}
                    <Text size="sm">
                      {formatNumber(Number(txInfo.to.value), 6)}{" "}
                      {txInfo.to.symbol}
                    </Text>
                  </Container>
                </div>
              </Container>
            </TxHashLink>
          );
        })}
      </Container>
    </Container>
  );
}

const IconBox = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.secondaryText,
    padding: spacing.xs,
    border: `2px solid ${theme.colors.borderColor}`,
    borderRadius: radius.lg,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
});

const TxHashLink = /* @__PURE__ */ StyledAnchor(() => {
  const theme = useCustomTheme();
  return {
    padding: `${spacing.xs} ${spacing.xxs}`,
    borderRadius: radius.lg,
    cursor: "pointer",
    animation: `${fadeInAnimation} 300ms ease`,
    "&:hover": {
      transition: "background 250ms ease",
      background: theme.colors.connectedButtonBgHover,
    },
  };
});
