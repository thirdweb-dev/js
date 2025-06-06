"use client";
import { useState } from "react";
import type { Token } from "../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { type Address, getAddress } from "../../../../utils/address.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { ConnectButton } from "../ConnectWallet/ConnectButton.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import { OutlineWalletIcon } from "../ConnectWallet/icons/OutlineWalletIcon.js";
import { WalletRow } from "../ConnectWallet/screens/Buy/swap/WalletRow.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
import { Spacer } from "../components/Spacer.js";
import { Container } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Input } from "../components/formElements.js";
import { Text } from "../components/text.js";
import type { UIOptions } from "./BridgeOrchestrator.js";
import { TokenAndChain } from "./common/TokenAndChain.js";
import { WithHeader } from "./common/WithHeader.js";

export interface FundWalletProps {
  /**
   * UI configuration and mode
   */
  uiOptions: Extract<UIOptions, { mode: "fund_wallet" }>;

  /**
   * The receiver address, defaults to the connected wallet address
   */
  receiverAddress?: Address;
  /**
   * ThirdwebClient for price fetching
   */
  client: ThirdwebClient;

  /**
   * Called when continue is clicked with the resolved requirements
   */
  onContinue: (amount: string, token: Token, receiverAddress: Address) => void;

  /**
   * Quick buy amounts
   */
  presetOptions?: [number, number, number];

  /**
   * Connect options for wallet connection
   */
  connectOptions?: PayEmbedConnectOptions;
}

export function FundWallet({
  client,
  receiverAddress,
  uiOptions,
  onContinue,
  presetOptions = [5, 10, 20],
  connectOptions,
}: FundWalletProps) {
  const [amount, setAmount] = useState(uiOptions.initialAmount ?? "");
  const theme = useCustomTheme();
  const account = useActiveAccount();
  const receiver = receiverAddress ?? account?.address;
  const handleAmountChange = (inputValue: string) => {
    let processedValue = inputValue;

    // Replace comma with period if it exists
    processedValue = processedValue.replace(",", ".");

    if (processedValue.startsWith(".")) {
      processedValue = `0${processedValue}`;
    }

    const numValue = Number(processedValue);
    if (Number.isNaN(numValue)) {
      return;
    }

    if (processedValue.startsWith("0") && !processedValue.startsWith("0.")) {
      setAmount(processedValue.slice(1));
    } else {
      setAmount(processedValue);
    }
  };

  const getAmountFontSize = () => {
    const length = amount.length;
    if (length > 12) return fontSize.md;
    if (length > 8) return fontSize.lg;
    return fontSize.xl;
  };

  const isValidAmount = amount && Number(amount) > 0;

  const focusInput = () => {
    const input = document.querySelector("#amount-input") as HTMLInputElement;
    input?.focus();
  };

  const handleQuickAmount = (usdAmount: number) => {
    if (uiOptions.destinationToken.priceUsd === 0) {
      return;
    }
    // Convert USD amount to token amount using token price
    const tokenAmount = usdAmount / uiOptions.destinationToken.priceUsd;
    // Format to reasonable decimal places (up to 6 decimals, remove trailing zeros)
    const formattedAmount = Number.parseFloat(
      tokenAmount.toFixed(6),
    ).toString();
    setAmount(formattedAmount);
  };

  return (
    <WithHeader
      uiOptions={uiOptions}
      defaultTitle={`Buy ${uiOptions.destinationToken.symbol}`}
      client={client}
    >
      <Container flex="column">
        {/* Token Info */}
        <Container
          flex="row"
          center="both"
          gap="3xs"
          p="md"
          style={{
            flexWrap: "nowrap",
            border: `1px solid ${theme.colors.borderColor}`,
            borderRadius: radius.md,
            backgroundColor: theme.colors.tertiaryBg,
          }}
        >
          <TokenAndChain
            token={uiOptions.destinationToken}
            client={client}
            size="xl"
          />
          {/* Amount Input */}
          <Container
            flex="column"
            gap="3xs"
            center="x"
            expand
            style={{
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{ cursor: "text" }}
              onClick={focusInput}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  focusInput();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <Container
                flex="row"
                center="y"
                gap="xs"
                style={{
                  flexWrap: "nowrap",
                  justifyContent: "flex-end",
                }}
              >
                <Input
                  id="amount-input"
                  variant="transparent"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  inputMode="decimal"
                  placeholder="0"
                  type="text"
                  data-placeholder={amount === ""}
                  value={amount || "0"}
                  onClick={(e) => {
                    // put cursor at the end of the input
                    if (amount === "") {
                      e.currentTarget.setSelectionRange(
                        e.currentTarget.value.length,
                        e.currentTarget.value.length,
                      );
                    }
                  }}
                  onChange={(e) => {
                    handleAmountChange(e.target.value);
                  }}
                  style={{
                    fontSize: getAmountFontSize(),
                    fontWeight: 600,
                    textAlign: "right",
                    padding: "0",
                    border: "none",
                    boxShadow: "none",
                  }}
                />
              </Container>
            </div>

            {/* Fiat Value */}
            <Container
              flex="row"
              center="both"
              style={{ height: fontSize.lg, flexWrap: "nowrap" }}
            >
              <Text
                size="md"
                color="secondaryText"
                style={{ textWrap: "nowrap" }}
              >
                ≈ $
                {(Number(amount) * uiOptions.destinationToken.priceUsd).toFixed(
                  2,
                )}
              </Text>
            </Container>
          </Container>
        </Container>

        {/* Quick Amount Buttons */}
        {presetOptions && (
          <>
            <Spacer y="md" />
            <Container
              flex="row"
              center="x"
              gap="xs"
              style={{
                justifyContent: "space-evenly",
              }}
            >
              {presetOptions?.map((amount) => (
                <Button
                  variant="outline"
                  onClick={() => handleQuickAmount(Number(amount))}
                  key={amount}
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    fontSize: fontSize.sm,
                    flex: 1,
                    backgroundColor: theme.colors.tertiaryBg,
                  }}
                >
                  ${amount}
                </Button>
              ))}
            </Container>
          </>
        )}

        <Spacer y="md" />

        <Container
          flex="row"
          gap="sm"
          px="md"
          py="sm"
          center="y"
          color="secondaryText"
          style={{
            border: `1px solid ${theme.colors.borderColor}`,
            backgroundColor: theme.colors.tertiaryBg,
            borderRadius: radius.md,
          }}
        >
          {receiver ? (
            <WalletRow
              address={receiver}
              client={client}
              iconSize="md"
              textSize="sm"
            />
          ) : (
            <>
              <OutlineWalletIcon size={iconSize.md} />
              <Text
                size="sm"
                color="secondaryText"
                style={{
                  flex: 1,
                }}
              >
                No Wallet Connected
              </Text>
            </>
          )}
        </Container>
      </Container>

      <Spacer y="lg" />

      {/* Continue Button */}
      {receiver ? (
        <Button
          variant="primary"
          fullWidth
          disabled={!isValidAmount}
          onClick={() => {
            if (isValidAmount) {
              onContinue(
                amount,
                uiOptions.destinationToken,
                getAddress(receiver),
              );
            }
          }}
          style={{
            padding: `${spacing.sm} ${spacing.md}`,
            fontSize: fontSize.md,
          }}
        >
          Buy {amount} {uiOptions.destinationToken.symbol}
        </Button>
      ) : (
        <ConnectButton
          client={client}
          theme={theme}
          connectButton={{
            label: `Buy ${amount} ${uiOptions.destinationToken.symbol}`,
          }}
          {...connectOptions}
        />
      )}

      <Spacer y="md" />

      <PoweredByThirdweb />
      <Spacer y="lg" />
    </WithHeader>
  );
}
