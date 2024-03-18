import { useSyncExternalStore } from "react";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { swapTransactionsStore } from "./Buy/swap/pendingSwapTx.js";
import { Spacer } from "../../components/Spacer.js";
import { ArrowTopBottom } from "../icons/ArrowTopBottom.js";
import { iconSize, radius, spacing } from "../../design-system/index.js";
import { StyledAnchor, StyledDiv } from "../../design-system/elements.js";
import { useCustomTheme } from "../../design-system/CustomThemeProvider.js";
import { Text } from "../../components/text.js";
import { ArrowRightIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { fadeInAnimation } from "../../design-system/animations.js";
import { Spinner } from "../../components/Spinner.js";
import { formatNumber } from "../../../../core/utils/formatNumber.js";
import { Button } from "../../components/buttons.js";
import { useChainQuery } from "../../../../core/hooks/others/useChainQuery.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../core/hooks/wallets/wallet-hooks.js";

/**
 * @internal
 */
export function SwapTransactionsScreen(props: { onBack: () => void }) {
  const swapTxs = useSyncExternalStore(
    swapTransactionsStore.subscribe,
    swapTransactionsStore.getValue,
  );

  const reversedTxs = [...swapTxs].reverse();
  const activeChain = useActiveWalletChain();
  const chainQuery = useChainQuery(activeChain);
  const activeAccount = useActiveAccount();
  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Transactions" onBack={props.onBack} />
      </Container>

      <Spacer y="xs" />

      <Container
        flex="column"
        gap="md"
        px="md"
        scrollY
        style={{
          minHeight: "200px",
          maxHeight: "350px",
        }}
      >
        {reversedTxs.length === 0 && (
          <Container flex="column" gap="md" center="both" color="secondaryText">
            <Spacer y="xl" />
            <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
            <Text> No Transactions </Text>
          </Container>
        )}

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
                      {formatNumber(Number(txInfo.to.value), 4)}{" "}
                      {txInfo.to.symbol}
                    </Text>
                  </Container>
                </div>
              </Container>
            </TxHashLink>
          );
        })}
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

const ButtonLink = /* @__PURE__ */ (() => Button.withComponent("a"))();

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
