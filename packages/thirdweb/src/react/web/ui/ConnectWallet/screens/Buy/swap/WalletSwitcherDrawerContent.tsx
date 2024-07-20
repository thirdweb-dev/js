import { PlusIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { Wallet } from "../../../../../../../wallets/interfaces/wallet.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
import { useConnectedWallets } from "../../../../../hooks/wallets/useConnectedWallets.js";
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
}) {
  const connectedWallets = useConnectedWallets();

  // if all wallets are connected and showAll wallets is disabled, hide the connect button
  const hideConnectButton =
    !props.showAllWallets &&
    props.wallets?.every((w) => connectedWallets.includes(w));

  return (
    <Container>
      <Text size="lg" color="primaryText">
        Pay with
      </Text>

      <Spacer y="lg" />

      <Container flex="column" gap="xs">
        {connectedWallets.map((w) => {
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
              checked={address === props.selectedAddress}
            />
          );
        })}
      </Container>

      <Spacer y="xxl" />

      {!hideConnectButton && (
        <Button variant="accent" fullWidth onClick={props.onConnect} gap="xs">
          <PlusIcon width={iconSize.sm} height={iconSize.sm} />
          Connect Wallet
        </Button>
      )}
    </Container>
  );
}
