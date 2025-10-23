"use client";
import { PlusIcon } from "@radix-ui/react-icons";
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
    <Container flex="column" gap="xs">
      {paymentMethods.includes("crypto") && (
        <>
          {/* Connected Wallets */}
          {connectedWallets.length > 0 && (
            <Container flex="column" gap="sm">
              {connectedWallets.map((wallet) => {
                const account = wallet.getAccount();
                if (!account?.address) {
                  return null;
                }
                return (
                  <Button
                    fullWidth
                    key={`${wallet.id}-${account.address}`}
                    onClick={() => onWalletSelected(wallet)}
                    style={{
                      borderRadius: radius.md,
                      justifyContent: "space-between",
                      padding: `${spacing.md} ${spacing.md}`,
                    }}
                    variant="secondary"
                  >
                    <WalletRow
                      address={account?.address}
                      client={client}
                      iconSize="lg"
                      textSize="sm"
                    />
                  </Button>
                );
              })}
            </Container>
          )}

          {/* Connect Another Wallet */}
          <Button
            fullWidth
            onClick={onConnectWallet}
            style={{
              borderRadius: radius.md,
              height: "auto",
              padding: `${spacing.md} ${spacing.md}`,
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
                  border: `1px dashed ${theme.colors.secondaryText}`,
                  borderRadius: radius.full,
                  display: "flex",
                  height: `${iconSize.lg}px`,
                  justifyContent: "center",
                  width: `${iconSize.lg}px`,
                }}
              >
                <PlusIcon
                  color={theme.colors.secondaryText}
                  height={iconSize["sm+"]}
                  width={iconSize["sm+"]}
                />
              </Container>
              <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                <Text color="primaryText" size="sm">
                  Connect a Wallet
                </Text>
                <Text color="secondaryText" size="xs">
                  Pay with any web3 wallet
                </Text>
              </Container>
            </Container>
          </Button>
        </>
      )}

      {paymentMethods.includes("card") && (
        <Button
          fullWidth
          onClick={onFiatSelected}
          style={{
            borderRadius: radius.md,
            height: "auto",
            padding: `${spacing.md} ${spacing.md}`,
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
              color={theme.colors.secondaryText}
              size={iconSize.lg}
            />
            <Container flex="column" gap="3xs" style={{ flex: 1 }}>
              <Text color="primaryText" size="sm">
                Pay with Card
              </Text>
              <Text color="secondaryText" size="xs">
                Onramp and pay in one step
              </Text>
            </Container>
          </Container>
        </Button>
      )}
    </Container>
  );
}
