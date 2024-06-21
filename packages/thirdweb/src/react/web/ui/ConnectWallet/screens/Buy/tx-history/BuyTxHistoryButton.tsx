import styled from "@emotion/styled";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import { spacing } from "../../../../../../core/design-system/index.js";
import { ChainName } from "../../../../components/ChainName.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { PayTokenIcon } from "../PayTokenIcon.js";
import {
  getBuyWithCryptoStatusMeta,
  getBuyWithFiatStatusMeta,
} from "./statusMeta.js";
import type { TxStatusInfo } from "./useBuyTransactionsToShow.js";

export const BuyTxHistoryButtonHeight = "62px";

export function BuyTxHistoryButton(props: {
  txInfo: TxStatusInfo;
  client: ThirdwebClient;
  onClick?: () => void;
}) {
  const statusMeta =
    props.txInfo.type === "swap"
      ? getBuyWithCryptoStatusMeta(props.txInfo.status)
      : getBuyWithFiatStatusMeta(props.txInfo.status);

  return (
    <TxButton
      onClick={props.onClick}
      variant="secondary"
      fullWidth
      style={{
        paddingBlock: spacing.sm,
      }}
    >
      <Container
        flex="row"
        center="y"
        gap="sm"
        style={{
          flex: 1,
        }}
      >
        <PayTokenIcon
          client={props.client}
          chain={getCachedChain(props.txInfo.status.quote.toToken.chainId)}
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
              Buy{" "}
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
              chain={getCachedChain(props.txInfo.status.quote.toToken.chainId)}
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
    </TxButton>
  );
}

const TxButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.tertiaryBg,
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
    },
    height: BuyTxHistoryButtonHeight,
  };
});
