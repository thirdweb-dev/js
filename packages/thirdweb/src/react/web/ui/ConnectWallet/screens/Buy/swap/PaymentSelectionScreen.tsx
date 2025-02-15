import { CardStackIcon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { Wallet } from "../../../../../../../wallets/interfaces/wallet.js";
import type { GetWalletBalanceResult } from "../../../../../../../wallets/utils/getWalletBalance.js";
import type { WalletId } from "../../../../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  spacing,
} from "../../../../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import type {
  SupportedTokens,
  TokenInfo,
} from "../../../../../../core/utils/defaultTokens.js";
import { Spacer } from "../../../../components/Spacer.js";
import { TextDivider } from "../../../../components/TextDivider.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenRow } from "../../../../components/token/TokenRow.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";

export type TokenBalance = {
  balance: GetWalletBalanceResult;
  chain: Chain;
  token: TokenInfo;
};

export function PaymentSelectionScreen(props: {
  client: ThirdwebClient;
  mode: PayUIOptions["mode"];
  showAllWallets: boolean;
  sourceSupportedTokens: SupportedTokens | undefined;
  toChain: Chain;
  toToken: ERC20OrNativeToken;
  fromToken: ERC20OrNativeToken;
  fromChain: Chain;
  tokenAmount: string;
  wallets: Wallet[] | undefined;
  onContinue: () => void;
  onSelectFiat: () => void;
  onBack: () => void;
  onConnect: () => void;
  onPickToken: () => void;
  hiddenWallets?: WalletId[];
  payWithFiatEnabled: boolean;
}) {
  const theme = useCustomTheme();

  return (
    <Container>
      <Container flex="column">
        <TokenRow
          client={props.client}
          onSelectToken={() => props.onPickToken()}
          token={props.fromToken}
          chain={props.fromChain}
        />
        <Spacer y="md" />
        <Button variant="accent" fullWidth onClick={() => props.onContinue()}>
          Continue
        </Button>

        <TextDivider text={"OR"} py="md" />

        {props.payWithFiatEnabled && (
          <Button
            variant="secondary"
            fullWidth
            gap="xs"
            bg="tertiaryBg"
            onClick={props.onSelectFiat}
            style={{
              border: `1px solid ${theme.colors.borderColor}`,
              padding: spacing.sm,
            }}
          >
            <Container
              flex="row"
              gap="sm"
              center="both"
              expand
              color="secondaryIconColor"
            >
              <CardStackIcon
                style={{
                  width: iconSize.md,
                  height: iconSize.md,
                }}
              />
              <Text size="sm" color="primaryText">
                Pay with credit card
              </Text>
            </Container>
          </Button>
        )}
      </Container>
      <Spacer y="sm" />
    </Container>
  );
}
