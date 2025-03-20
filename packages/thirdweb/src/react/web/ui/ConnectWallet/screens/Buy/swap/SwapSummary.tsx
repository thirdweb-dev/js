import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import { radius } from "../../../../../../core/design-system/index.js";
import { Container } from "../../../../components/basic.js";
import { TokenRow } from "../../../../components/token/TokenRow.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { StepConnectorArrow } from "./StepConnector.js";
import { WalletRow } from "./WalletRow.js";

export function SwapSummary(props: {
  sender: string;
  receiver: string;
  client: ThirdwebClient;
  fromToken: ERC20OrNativeToken;
  fromChain: Chain;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  fromAmount: string;
  toAmount: string;
}) {
  const theme = useCustomTheme();
  const isDifferentRecipient =
    props.receiver.toLowerCase() !== props.sender.toLowerCase();
  return (
    <Container>
      {/* Sell */}
      <Container
        bg="tertiaryBg"
        flex="column"
        style={{
          borderRadius: radius.lg,
          border: `1px solid ${theme.colors.borderColor}`,
        }}
      >
        <Container
          flex="row"
          gap="sm"
          p="sm"
          style={{
            borderBottom: `1px solid ${theme.colors.borderColor}`,
          }}
        >
          <WalletRow
            address={props.sender}
            client={props.client}
            iconSize="md"
            textSize="sm"
          />
        </Container>
        <TokenRow
          token={props.fromToken}
          chain={props.fromChain}
          client={props.client}
          isLoading={false}
          value={props.fromAmount}
          freezeChainAndToken={true}
          onSelectToken={() => {}}
          style={{
            background: "transparent",
            borderRadius: 0,
            border: "none",
          }}
        />
      </Container>
      {/* Connector Icon */}
      <StepConnectorArrow />
      {/* Buy */}
      <Container
        flex="column"
        bg="tertiaryBg"
        style={{
          borderRadius: radius.lg,
          border: `1px solid ${theme.colors.borderColor}`,
        }}
      >
        {isDifferentRecipient && (
          <Container
            flex="row"
            gap="sm"
            p="sm"
            style={{
              borderBottom: `1px solid ${theme.colors.borderColor}`,
            }}
          >
            <WalletRow
              address={props.receiver}
              client={props.client}
              iconSize="md"
              textSize="sm"
            />
          </Container>
        )}
        <TokenRow
          token={props.toToken}
          chain={props.toChain}
          client={props.client}
          isLoading={false}
          value={props.toAmount}
          freezeChainAndToken={true}
          onSelectToken={() => {}}
          style={{
            background: "transparent",
            borderRadius: 0,
            border: "none",
          }}
        />
      </Container>
    </Container>
  );
}
