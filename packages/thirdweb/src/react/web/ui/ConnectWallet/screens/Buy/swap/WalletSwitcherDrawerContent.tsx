import { PlusIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { Wallet } from "../../../../../../../wallets/interfaces/wallet.js";
import type { WalletId } from "../../../../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { useConnectedWallets } from "../../../../../../core/hooks/wallets/useConnectedWallets.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { WalletSelectorButton } from "../WalletSelectorButton.js";

export function WalletSwitcherDrawerContent(props: {
  client: ThirdwebClient;
  showAllWallets: boolean;
  wallets: Wallet[] | undefined;
  onSelect: (wallet: Wallet) => void;
  onBack: () => void;
  onConnect: () => void;
  selectedAddress: string;
  hiddenWallets?: WalletId[];
}) {
  const theme = useCustomTheme();
  const connectedWallets = useConnectedWallets();

  // if all wallets are connected and showAll wallets is disabled, hide the connect button
  const hideConnectButton =
    !props.showAllWallets &&
    props.wallets?.every((w) => connectedWallets.includes(w));

  return (
    <Container>
      <Container flex="column" gap="xs">
        {connectedWallets
          .filter((w) => !props.hiddenWallets?.includes(w.id))
          .map((w) => {
            const address = w.getAccount()?.address;
            return (
              <WalletSelectorButton
                key={w.id}
                walletId={w.id}
                client={props.client}
                address={address || ""}
                onClick={() => {
                  props.onSelect(w);
                  props.onBack();
                }}
                disableChevron
                checked={false}
              />
            );
          })}
        {!hideConnectButton && (
          <Button
            variant="secondary"
            fullWidth
            onClick={props.onConnect}
            gap="xs"
            bg="tertiaryBg"
            style={{
              borderRadius: radius.lg,
              border: `1px solid ${theme.colors.borderColor}`,
              padding: spacing.sm,
            }}
          >
            <Container flex="row" gap="sm" center="y" expand>
              <PlusIcon width={iconSize.md} height={iconSize.md} />
              <Text size="sm" color="primaryText">
                Add Another Wallet
              </Text>
            </Container>
          </Button>
        )}
      </Container>
      <Spacer y="sm" />
    </Container>
  );
}
