import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { spacing } from "../../../../../../core/design-system/index.js";
import { ChainName } from "../../../../components/ChainName.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { PayTokenIcon } from "../PayTokenIcon.js";

export function TokenSelectedLayout(props: {
  children: React.ReactNode;
  tokenAmount: string;
  selectedToken: ERC20OrNativeToken;
  selectedChain: Chain;
  client: ThirdwebClient;
  onBack: () => void;
}) {
  return (
    <Container>
      <Container p="lg">
        <ModalHeader title={"Buy"} onBack={props.onBack} />
      </Container>

      <Container
        px="lg"
        style={{
          paddingBottom: spacing.lg,
        }}
      >
        <Spacer y="xs" />
        <SelectedTokenInfo
          selectedToken={props.selectedToken}
          selectedChain={props.selectedChain}
          tokenAmount={props.tokenAmount}
          client={props.client}
        />

        <Spacer y="md" />
        <Line />
        <Spacer y="lg" />

        <Text size="sm"> Pay with </Text>
        <Spacer y="sm" />

        {props.children}
      </Container>
    </Container>
  );
}

function SelectedTokenInfo(props: {
  selectedToken: ERC20OrNativeToken;
  selectedChain: Chain;
  tokenAmount: string;
  client: ThirdwebClient;
}) {
  return (
    <div>
      <Container
        flex="row"
        gap="sm"
        center="y"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Container flex="row" gap="xs" center="y">
          <Text color="primaryText" data-testid="tokenAmount" size="xxl">
            {formatNumber(Number(props.tokenAmount), 3)}
          </Text>

          <Container flex="row" gap="xxs" center="y">
            <TokenSymbol
              token={props.selectedToken}
              chain={props.selectedChain}
              size="md"
              color="secondaryText"
            />
            <PayTokenIcon
              chain={props.selectedChain}
              client={props.client}
              size="sm"
              token={props.selectedToken}
            />
          </Container>
        </Container>

        <ChainName
          chain={props.selectedChain}
          client={props.client}
          size="sm"
          short
        />
      </Container>
    </div>
  );
}
