"use client";
import { ShuffleIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { isInAppWallet } from "../../../../../wallets/in-app/core/wallet/index.js";
import { injectedProvider } from "../../../../../wallets/injected/mipdStore.js";
import { fontSize, iconSize } from "../../../../core/design-system/index.js";
import type { ConnectButton_detailsModalOptions } from "../../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useAdminWallet } from "../../../../core/hooks/wallets/useAdminWallet.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { KeyIcon } from "../icons/KeyIcon.js";
import { MultiUserIcon } from "../icons/MultiUserIcon.js";
import { WalletConnectIcon } from "../icons/WalletConnectIcon.js";
import type { ConnectLocale } from "../locale/types.js";
import { MenuButton } from "../MenuButton.js";
import type { WalletDetailsModalScreen } from "./types.js";

/**
 * @internal
 */
export function ManageWalletScreen(props: {
  onBack: () => void;
  setScreen: (screen: WalletDetailsModalScreen) => void;
  closeModal: () => void;
  locale: ConnectLocale;
  client: ThirdwebClient;
  manageWallet?: ConnectButton_detailsModalOptions["manageWallet"];
}) {
  const adminWallet = useAdminWallet();
  const activeWallet = useActiveWallet();
  const wallet = adminWallet || activeWallet;

  return (
    <Container
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader
          onBack={props.onBack}
          title={props.locale.manageWallet.title}
        />
      </Container>
      <Line />
      <Container
        px="sm"
        scrollY
        style={{
          maxHeight: "500px",
        }}
      >
        <Spacer y="md" />
        <Container style={{ height: "250px", position: "relative" }}>
          {/* Switch Metamask Account (only shows if the active wallet is MetaMask) */}
          <SwitchMetamaskAccount
            closeModal={props.closeModal}
            connectLocale={props.locale}
          />

          {/* Unified Identity */}
          {typeof wallet !== "undefined" &&
            props.manageWallet?.allowLinkingProfiles !== false && (
              <MenuButton
                onClick={() => {
                  props.setScreen("linked-profiles");
                }}
                style={{
                  fontSize: fontSize.sm,
                }}
              >
                <MultiUserIcon size={iconSize.md} />
                <Text color="primaryText">
                  {props.locale.manageWallet.linkedProfiles}
                </Text>
              </MenuButton>
            )}

          {/* Wallet Connect Receiver */}
          <MenuButton
            onClick={() => {
              props.setScreen("wallet-connect-receiver");
            }}
            style={{
              fontSize: fontSize.sm,
            }}
          >
            <WalletConnectIcon size={iconSize.md} />
            <Text color="primaryText">
              {props.locale.manageWallet.connectAnApp}
            </Text>
          </MenuButton>

          {/* Private Key Export (if enabled) */}
          {wallet &&
            isInAppWallet(wallet) &&
            !wallet.getConfig()?.hidePrivateKeyExport && (
              <MenuButton
                onClick={() => {
                  props.setScreen("private-key");
                }}
                style={{
                  fontSize: fontSize.sm,
                }}
              >
                <KeyIcon size={iconSize.md} />
                <Text color="primaryText">
                  {props.locale.manageWallet.exportPrivateKey}
                </Text>
              </MenuButton>
            )}
        </Container>
        <Spacer y="lg" />
      </Container>
    </Container>
  );
}

function SwitchMetamaskAccount(props: {
  closeModal: () => void;
  connectLocale: ConnectLocale;
}) {
  const wallet = useActiveWallet();
  const connectLocale = props.connectLocale;

  if (wallet?.id !== "io.metamask") {
    return null;
  }

  const injectedMetamaskProvider = injectedProvider("io.metamask");

  if (!injectedMetamaskProvider) {
    return null;
  }

  return (
    <MenuButton
      onClick={async () => {
        await injectedMetamaskProvider.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        props.closeModal();
      }}
      type="button"
    >
      <ShuffleIcon height={iconSize.md} width={iconSize.md} />
      <Text color="primaryText">{connectLocale.switchAccount}</Text>
    </MenuButton>
  );
}
