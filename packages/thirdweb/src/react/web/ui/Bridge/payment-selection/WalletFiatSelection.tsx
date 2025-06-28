"use client";
import { ChevronRightIcon, PlusIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { CreditCardIcon } from "../../ConnectWallet/icons/CreditCardIcon.js";
import { WalletRow } from "../../ConnectWallet/screens/Buy/swap/WalletRow.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";

interface WalletFiatSelectionProps {
  connectedWallets: Wallet[];
  client: ThirdwebClient;
  onWalletSelected: (wallet: Wallet) => void;
  onFiatSelected: () => void;
  onConnectWallet: () => void;
  paymentMethods?: ("crypto" | "card")[];
}

export function WalletFiatSelection({
  connectedWallets,
  client,
  onWalletSelected,
  onFiatSelected,
  onConnectWallet,
  paymentMethods = ["crypto", "card"],
}: WalletFiatSelectionProps) {
  const theme = useCustomTheme();

  return (
    <>
      {paymentMethods.includes("crypto") && (
        <>
          <Text color="primaryText" size="md">
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
                      fullWidth
                      key={wallet.id}
                      onClick={() => onWalletSelected(wallet)}
                      style={{
                        backgroundColor: theme.colors.tertiaryBg,
                        border: `1px solid ${theme.colors.borderColor}`,
                        borderRadius: radius.md,
                        justifyContent: "space-between",
                        padding: `${spacing.sm} ${spacing.md}`,
                      }}
                      variant="secondary"
                    >
                      <WalletRow
                        address={account?.address}
                        client={client}
                        iconSize="lg"
                        textSize="sm"
                      />
                      <ChevronRightIcon
                        style={{ height: iconSize.md, width: iconSize.md }}
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
            fullWidth
            onClick={onConnectWallet}
            style={{
              backgroundColor: theme.colors.tertiaryBg,
              border: `1px solid ${theme.colors.borderColor}`,
              borderRadius: radius.md,
              height: "auto",
              padding: `${spacing.sm} ${spacing.md}`,
              textAlign: "left",
            }}
            variant="secondary"
          >
            <Container
              flex="row"
              gap="md"
              style={{ alignItems: "center", width: "100%" }}
            >
              <Container
                style={{
                  alignItems: "center",
                  border: `1px dashed ${theme.colors.secondaryIconColor}`,
                  borderRadius: radius.sm,
                  display: "flex",
                  height: iconSize.lg,
                  justifyContent: "center",
                  padding: spacing["4xs"],
                  width: iconSize.lg,
                }}
              >
                <PlusIcon
                  color={theme.colors.secondaryText}
                  height={iconSize.md}
                  width={iconSize.md}
                />
              </Container>
              <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                <Text color="primaryText" size="sm" style={{ fontWeight: 600 }}>
                  Connect Another Wallet
                </Text>
                <Text color="secondaryText" size="xs">
                  Use a different wallet to pay
                </Text>
              </Container>
            </Container>
          </Button>
        </>
      )}

      {paymentMethods.includes("card") && (
        <>
          <Spacer y="md" />

          <Text color="primaryText" size="md">
            Pay with Card
          </Text>

          <Spacer y="md" />

          <Button
            fullWidth
            onClick={onFiatSelected}
            style={{
              backgroundColor: theme.colors.tertiaryBg,
              border: `1px solid ${theme.colors.borderColor}`,
              borderRadius: radius.md,
              height: "auto",
              padding: `${spacing.sm} ${spacing.md}`,
              textAlign: "left",
            }}
            variant="secondary"
          >
            <Container
              flex="row"
              gap="md"
              style={{ alignItems: "center", width: "100%" }}
            >
              <CreditCardIcon
                color={theme.colors.secondaryIconColor}
                size={iconSize.lg}
              />
              <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                <Text color="primaryText" size="sm" style={{ fontWeight: 600 }}>
                  Pay with Card
                </Text>
                <Text color="secondaryText" size="xs">
                  Buy crypto and bridge in one step
                </Text>
              </Container>
            </Container>
          </Button>
        </>
      )}
    </>
  );
}
