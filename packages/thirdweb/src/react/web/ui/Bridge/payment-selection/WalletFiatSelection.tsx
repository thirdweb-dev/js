"use client";
import {
  CardStackIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { WalletRow } from "../../ConnectWallet/screens/Buy/swap/WalletRow.js";
import { Spacer } from "../../components/Spacer.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";

export interface WalletFiatSelectionProps {
  connectedWallets: Wallet[];
  client: ThirdwebClient;
  onWalletSelected: (wallet: Wallet) => void;
  onFiatSelected: () => void;
  onConnectWallet: () => void;
}

export function WalletFiatSelection({
  connectedWallets,
  client,
  onWalletSelected,
  onFiatSelected,
  onConnectWallet,
}: WalletFiatSelectionProps) {
  const theme = useCustomTheme();

  return (
    <>
      <Text size="md" color="primaryText">
        Pay with Crypto
      </Text>
      <Spacer y="md" />
      {/* Connected Wallets */}
      {connectedWallets.length > 0 && (
        <>
          <Container flex="column" gap="sm">
            {connectedWallets.map((wallet) => {
              const account = wallet.getAccount();
              if (!account?.address) {
                return null;
              }
              return (
                <Button
                  key={wallet.id}
                  variant="secondary"
                  fullWidth
                  onClick={() => onWalletSelected(wallet)}
                  style={{
                    border: `1px solid ${theme.colors.borderColor}`,
                    borderRadius: radius.md,
                    padding: `${spacing.sm} ${spacing.md}`,
                    backgroundColor: theme.colors.tertiaryBg,
                    justifyContent: "space-between",
                  }}
                >
                  <WalletRow
                    client={client}
                    address={account?.address}
                    iconSize="lg"
                    textSize="sm"
                  />
                  <ChevronRightIcon
                    style={{ width: iconSize.md, height: iconSize.md }}
                  />
                </Button>
              );
            })}
          </Container>
          <Spacer y="sm" />
        </>
      )}

      {/* Connect Another Wallet */}
      <Button
        variant="secondary"
        fullWidth
        onClick={onConnectWallet}
        style={{
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: radius.md,
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: theme.colors.tertiaryBg,
          textAlign: "left",
          height: "auto",
        }}
      >
        <Container
          flex="row"
          gap="md"
          style={{ width: "100%", alignItems: "center" }}
        >
          <Container
            style={{
              borderRadius: radius.sm,
              border: `2px dashed ${theme.colors.borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: spacing["4xs"],
              width: iconSize.lg,
              height: iconSize.lg,
            }}
          >
            <PlusIcon
              width={iconSize.md}
              height={iconSize.md}
              color={theme.colors.secondaryText}
            />
          </Container>
          <Container flex="column" gap="3xs" style={{ flex: 1 }}>
            <Text size="sm" color="primaryText" style={{ fontWeight: 600 }}>
              Connect Another Wallet
            </Text>
            <Text size="xs" color="secondaryText">
              Use a different wallet to pay
            </Text>
          </Container>
        </Container>
      </Button>

      <Spacer y="lg" />

      {/* Pay with Debit Card */}
      <Text size="md" color="primaryText">
        Pay with Fiat
      </Text>

      <Spacer y="md" />

      <Button
        variant="secondary"
        fullWidth
        onClick={onFiatSelected}
        style={{
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: radius.md,
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: theme.colors.tertiaryBg,
          textAlign: "left",
          height: "auto",
        }}
      >
        <Container
          flex="row"
          gap="md"
          style={{ width: "100%", alignItems: "center" }}
        >
          <CardStackIcon
            width={iconSize.lg}
            height={iconSize.lg}
            color={theme.colors.secondaryText}
          />
          <Container flex="column" gap="3xs" style={{ flex: 1 }}>
            <Text size="sm" color="primaryText" style={{ fontWeight: 600 }}>
              Pay with Card
            </Text>
            <Text size="xs" color="secondaryText">
              Buy crypto and bridge in one step
            </Text>
          </Container>
        </Container>
      </Button>
    </>
  );
}
