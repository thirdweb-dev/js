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
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: radius.lg,
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
          chain={props.fromChain}
          client={props.client}
          freezeChainAndToken={true}
          isLoading={false}
          onSelectToken={() => {}}
          style={{
            background: "transparent",
            border: "none",
            borderRadius: 0,
          }}
          token={props.fromToken}
          value={props.fromAmount}
        />
      </Container>
      {/* Connector Icon */}
      <StepConnectorArrow />
      {/* Buy */}
      <Container
        bg="tertiaryBg"
        flex="column"
        style={{
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: radius.lg,
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
          chain={props.toChain}
          client={props.client}
          freezeChainAndToken={true}
          isLoading={false}
          onSelectToken={() => {}}
          style={{
            background: "transparent",
            border: "none",
            borderRadius: 0,
          }}
          token={props.toToken}
          value={props.toAmount}
        />
      </Container>
    </Container>
  );
}
