/** biome-ignore-all lint/a11y/useSemanticElements: FIXME */
"use client";
import { useRef, useState } from "react";
import type { TokenWithPrices } from "../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../pay/convert/type.js";
import { type Address, getAddress } from "../../../../utils/address.js";
import { numberToPlainString } from "../../../../utils/formatNumber.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { ConnectButton } from "../ConnectWallet/ConnectButton.js";
import { OutlineWalletIcon } from "../ConnectWallet/icons/OutlineWalletIcon.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import { WalletRow } from "../ConnectWallet/screens/Buy/swap/WalletRow.js";
import { formatCurrencyAmount } from "../ConnectWallet/screens/formatTokenBalance.js";
import { Container } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Input } from "../components/formElements.js";
import { Spacer } from "../components/Spacer.js";
import { Text } from "../components/text.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
import { TokenAndChain } from "./common/TokenAndChain.js";
import { WithHeader } from "./common/WithHeader.js";

type FundWalletProps = {
  /**
   * The receiver address, defaults to the connected wallet address
   */
  receiverAddress: Address | undefined;
  /**
   * ThirdwebClient for price fetching
   */
  client: ThirdwebClient;

  /**
   * Called when continue is clicked with the resolved requirements
   */
  onContinue: (
    amount: string,
    token: TokenWithPrices,
    receiverAddress: Address,
  ) => void;

  /**
   * Quick buy amounts
   */
  presetOptions: [number, number, number];

  /**
   * Connect options for wallet connection
   */
  connectOptions: PayEmbedConnectOptions | undefined;

  /**
   * Whether to show thirdweb branding in the widget.
   */
  showThirdwebBranding: boolean;

  /**
   * The initial amount to prefill the input with
   */
  initialAmount: string | undefined;

  /**
   * The destination token to buy
   */
  destinationToken: TokenWithPrices;

  /**
   * The currency to use for the payment.
   */
  currency: SupportedFiatCurrency;

  /**
   * Override label to display on the button
   */
  buttonLabel: string | undefined;

  /**
   * The metadata to display in the widget.
   */
  metadata: {
    title: string | undefined;
    description: string | undefined;
    image: string | undefined;
  };
};

export function FundWallet({
  client,
  receiverAddress,
  onContinue,
  presetOptions,
  connectOptions,
  showThirdwebBranding,
  initialAmount,
  destinationToken,
  currency,
  buttonLabel,
  metadata,
}: FundWalletProps) {
  const [amount, setAmount] = useState(initialAmount ?? "");
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

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleQuickAmount = (usdAmount: number) => {
    const price = destinationToken.prices[currency || "USD"] || 0;
    if (price === 0) {
      return;
    }
    // Convert USD amount to token amount using token price
    const tokenAmount = usdAmount / price;
    // Format to reasonable decimal places (up to 6 decimals, remove trailing zeros)
    const formattedAmount = numberToPlainString(
      Number.parseFloat(tokenAmount.toFixed(6)),
    );
    setAmount(formattedAmount);
  };

  return (
    <WithHeader
      client={client}
      title={
        metadata.title === undefined
          ? `Buy ${destinationToken.symbol}`
          : metadata.title
      }
      description={metadata.description}
      image={metadata.image}
    >
      <Container flex="column">
        {/* Token Info */}
        <Container
          center="both"
          flex="row"
          gap="3xs"
          p="md"
          style={{
            backgroundColor: theme.colors.tertiaryBg,
            border: `1px solid ${theme.colors.borderColor}`,
            borderRadius: radius.lg,
            flexWrap: "nowrap",
          }}
        >
          <TokenAndChain client={client} size="xl" token={destinationToken} />
          {/* Amount Input */}
          <Container
            center="x"
            expand
            flex="column"
            gap="3xs"
            style={{
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <div
              onClick={focusInput}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  focusInput();
                }
              }}
              role="button"
              style={{ cursor: "text" }}
              tabIndex={0}
            >
              <Container
                center="y"
                flex="row"
                gap="xs"
                style={{
                  flexWrap: "nowrap",
                  justifyContent: "flex-end",
                }}
              >
                <Input
                  data-placeholder={amount === ""}
                  inputMode="decimal"
                  onChange={(e) => {
                    handleAmountChange(e.target.value);
                  }}
                  onClick={(e) => {
                    // put cursor at the end of the input
                    if (amount === "") {
                      e.currentTarget.setSelectionRange(
                        e.currentTarget.value.length,
                        e.currentTarget.value.length,
                      );
                    }
                  }}
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="0"
                  ref={inputRef}
                  style={{
                    border: "none",
                    boxShadow: "none",
                    fontSize: getAmountFontSize(),
                    fontWeight: 600,
                    padding: "0",
                    textAlign: "right",
                  }}
                  type="text"
                  value={amount || "0"}
                  variant="transparent"
                />
              </Container>
            </div>

            {/* Fiat Value */}
            <Container
              center="both"
              flex="row"
              style={{ flexWrap: "nowrap", height: fontSize.lg }}
            >
              <Text
                color="secondaryText"
                size="md"
                style={{ textWrap: "nowrap" }}
              >
                ≈{" "}
                {formatCurrencyAmount(
                  currency || "USD",
                  Number(amount) *
                    (destinationToken.prices[currency || "USD"] || 0),
                )}
              </Text>
            </Container>
          </Container>
        </Container>

        {/* Quick Amount Buttons */}
        {presetOptions && (
          <>
            <Spacer y="sm" />
            <Container
              center="x"
              flex="row"
              gap="sm"
              style={{
                justifyContent: "space-evenly",
              }}
            >
              {presetOptions?.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handleQuickAmount(Number(amount))}
                  style={{
                    backgroundColor: theme.colors.tertiaryBg,
                    flex: 1,
                    fontSize: fontSize.sm,
                    borderRadius: radius.lg,
                    padding: `${spacing.sm} ${spacing.md}`,
                  }}
                  variant="outline"
                >
                  ${amount}
                </Button>
              ))}
            </Container>
          </>
        )}

        <Spacer y="sm" />

        <Container
          center="y"
          color="secondaryText"
          flex="row"
          gap="sm"
          px="md"
          py="sm"
          style={{
            backgroundColor: theme.colors.tertiaryBg,
            border: `1px solid ${theme.colors.borderColor}`,
            borderRadius: radius.lg,
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
                color="secondaryText"
                size="sm"
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
          disabled={!isValidAmount}
          fullWidth
          onClick={() => {
            if (isValidAmount) {
              onContinue(amount, destinationToken, getAddress(receiver));
            }
          }}
          style={{
            fontSize: fontSize.md,
            borderRadius: radius.lg,
          }}
          variant="primary"
        >
          {buttonLabel || `Buy ${amount} ${destinationToken.symbol}`}
        </Button>
      ) : (
        <ConnectButton
          client={client}
          connectButton={{
            label: buttonLabel || `Buy ${amount} ${destinationToken.symbol}`,
          }}
          theme={theme}
          {...connectOptions}
        />
      )}

      {showThirdwebBranding ? (
        <div>
          <Spacer y="md" />
          <PoweredByThirdweb link="https://playground.thirdweb.com/payments/fund-wallet" />
        </div>
      ) : null}
      <Spacer y="md" />
    </WithHeader>
  );
}
