import { CheckIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { shortenAddress } from "../../../../../../utils/address.js";
import type {
  Account,
  Wallet,
} from "../../../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../../core/design-system/index.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import { useActiveWallet } from "../../../../../core/hooks/wallets/useActiveWallet.js";
import { useConnectedWallets } from "../../../../../core/hooks/wallets/useConnectedWallets.js";
import { useDisconnect } from "../../../../../core/hooks/wallets/useDisconnect.js";
import { useSetActiveWallet } from "../../../../../core/hooks/wallets/useSetActiveWallet.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button, IconButton } from "../../../components/buttons.js";
import { Skeleton } from "../../../components/Skeleton.js";
import { Spacer } from "../../../components/Spacer.js";
import { ToolTip } from "../../../components/Tooltip.js";
import { Text } from "../../../components/text.js";
import { WalletImage } from "../../../components/WalletImage.js";
import { WalletButtonEl } from "../../WalletEntryButton.js";
import { formatTokenBalance } from "../formatTokenBalance.js";
import {
  WalletSwitcherConnectionScreen,
  type WalletSwitcherConnectionScreenProps,
} from "../WalletSwitcherConnectionScreen.js";

export function WalletManagerScreen(
  props: Omit<
    WalletSwitcherConnectionScreenProps,
    "onSelect" | "isEmbed" | "selectedWallet"
  > & {
    activeAccount: Account;
    activeWallet: Wallet;
    activeChain: Chain;
  },
) {
  const [screen, setScreen] = useState<"wallets" | "connect">("wallets");
  const connectedWallets = useConnectedWallets();
  const setActive = useSetActiveWallet();

  // if all wallets are connected and showAll wallets is disabled, hide the connect button
  const hideConnectButton =
    !props.showAllWallets &&
    props.wallets?.every((w) => connectedWallets.includes(w));

  if (screen === "connect") {
    return (
      <WalletSwitcherConnectionScreen
        {...props}
        isEmbed={false}
        onSelect={(w) => {
          setActive(w);
          props.onBack();
        }}
      />
    );
  }

  return (
    <Container>
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title="Wallets" />
      </Container>

      <Line />
      <Spacer y="md" />

      <Container
        px="md"
        style={{
          minHeight: "150px",
        }}
      >
        <Container flex="column" gap="xs">
          {connectedWallets
            .filter((w) => !props.hiddenWallets?.includes(w.id))
            .map((w) => {
              return (
                <WalletManangerButton
                  chain={props.activeChain}
                  client={props.client}
                  // address={address || ""}
                  key={w.id}
                  onClick={() => {
                    setActive(w);
                    props.onBack();
                  }}
                  wallet={w}
                />
              );
            })}
        </Container>
      </Container>

      <Spacer y="xxl" />

      <Container p="lg">
        {!hideConnectButton && (
          <Button
            fullWidth
            gap="xs"
            onClick={() => {
              setScreen("connect");
            }}
            variant="accent"
          >
            <PlusIcon height={iconSize.sm} width={iconSize.sm} />
            Connect Wallet
          </Button>
        )}
      </Container>
    </Container>
  );
}

function WalletManangerButton(props: {
  wallet: Wallet;
  client: ThirdwebClient;
  chain: Chain;
  onClick: () => void;
}) {
  const theme = useCustomTheme();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const walletId = props.wallet.id;
  const address = props.wallet.getAccount()?.address;
  const balanceQuery = useWalletBalance({
    address: address,
    chain: props.chain,
    client: props.client,
  });

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <WalletButtonEl
        onClick={props.onClick}
        style={{
          justifyContent: "space-between",
        }}
      >
        <Container center="y" flex="row" gap="md">
          <WalletImage client={props.client} id={walletId} size={iconSize.lg} />

          <Container flex="column" gap="4xs">
            <Text color="primaryText">{shortenAddress(address || "")}</Text>
            {balanceQuery.data ? (
              <Text color="secondaryText" size="xs" weight={400}>
                {formatTokenBalance(balanceQuery.data)}
              </Text>
            ) : (
              <Skeleton height={fontSize.sm} width="100px" />
            )}
          </Container>
        </Container>
      </WalletButtonEl>

      <div
        style={{
          position: "absolute",
          right: spacing.xxs,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      >
        {activeWallet?.id === props.wallet.id ? (
          <ToolTip tip="Active Wallet">
            <IconButton>
              <CheckIcon height={iconSize.md} width={iconSize.md} />
            </IconButton>
          </ToolTip>
        ) : (
          <ToolTip tip="Disconnect">
            <IconButton
              onClick={() => {
                disconnect(props.wallet);
              }}
            >
              <MinusIcon
                height={iconSize.md}
                style={{
                  color: theme.colors.secondaryText,
                }}
                width={iconSize.md}
              />
            </IconButton>
          </ToolTip>
        )}
      </div>
    </div>
  );
}
