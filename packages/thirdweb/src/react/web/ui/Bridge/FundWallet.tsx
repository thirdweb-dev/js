/** biome-ignore-all lint/a11y/useSemanticElements: FIXME */
"use client";
import { useEffect, useRef, useState } from "react";
import type { TokenWithPrices } from "../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  getFiatSymbol,
  type SupportedFiatCurrency,
} from "../../../../pay/convert/type.js";
import {
  type Address,
  checksumAddress,
  getAddress,
  isAddress,
  shortenAddress,
} from "../../../../utils/address.js";
import { getDefaultWalletsForBridgeComponents } from "../../../../wallets/defaultWallets.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  type Theme,
} from "../../../core/design-system/index.js";
import { ConnectButton } from "../ConnectWallet/ConnectButton.js";
import { DetailsModal } from "../ConnectWallet/Details.js";
import { ArrowUpDownIcon } from "../ConnectWallet/icons/ArrowUpDownIcon.js";
import connectLocaleEn from "../ConnectWallet/locale/en.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import { formatTokenAmount } from "../ConnectWallet/screens/formatTokenBalance.js";
import { Container } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Input } from "../components/formElements.js";
import { Modal } from "../components/Modal.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { Text } from "../components/text.js";
import { useIsMobile } from "../hooks/useisMobile.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
import { ActiveWalletDetails } from "./common/active-wallet-details.js";
import { DecimalInput } from "./common/decimal-input.js";
import { SelectedTokenButton } from "./common/selected-token-button.js";
import { useTokenBalance } from "./common/token-balance.js";
import { useTokenQuery } from "./common/token-query.js";
// import { TokenAndChain } from "./common/TokenAndChain.js";
import { WithHeader } from "./common/WithHeader.js";
import { useActiveWalletInfo } from "./swap-widget/hooks.js";
import { SelectToken } from "./swap-widget/select-token-ui.js";
import type { ActiveWalletInfo } from "./swap-widget/types.js";
import { useBridgeChain } from "./swap-widget/use-bridge-chains.js";

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

  selectedToken: SelectedToken | undefined;
  setSelectedToken: (token: SelectedToken | undefined) => void;
  amountSelection: AmountSelection;
  setAmountSelection: (amountSelection: AmountSelection) => void;

  /**
   * The currency to use for the payment.
   */
  currency: SupportedFiatCurrency;

  /**
   * Override label to display on the button
   */
  buttonLabel: string | undefined;

  theme: "light" | "dark" | Theme;

  onDisconnect: (() => void) | undefined;

  /**
   * The metadata to display in the widget.
   */
  metadata: {
    title: string | undefined;
    description: string | undefined;
    image: string | undefined;
  };

  /**
   * Whether the user can edit the amount. Defaults to true.
   */
  amountEditable: boolean;

  /**
   * Whether the user can edit the token selection. Defaults to true.
   */
  tokenEditable: boolean;
};

export type SelectedToken =
  | {
      chainId: number;
      tokenAddress: string;
    }
  | undefined;

export type AmountSelection =
  | {
      type: "usd";
      value: string;
    }
  | {
      type: "token";
      value: string;
    };

export function FundWallet(props: FundWalletProps) {
  const theme = useCustomTheme();
  const activeWalletInfo = useActiveWalletInfo();
  const defaultReceiver =
    props.receiverAddress ?? activeWalletInfo?.activeAccount?.address;
  const [receiverAddressMode, setReceiverAddressMode] = useState<
    "wallet" | "custom"
  >(props.receiverAddress ? "custom" : "wallet");
  const [receiverAddressInput, setReceiverAddressInput] = useState<string>(
    props.receiverAddress || "",
  );
  const [showReceiverDropdown, setShowReceiverDropdown] = useState(false);
  const [receiverAddressModalOpen, setReceiverAddressModalOpen] =
    useState(false);
  const [tempReceiverAddress, setTempReceiverAddress] = useState<string>("");
  const receiverDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showReceiverDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        receiverDropdownRef.current &&
        !receiverDropdownRef.current.contains(event.target as Node)
      ) {
        setShowReceiverDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReceiverDropdown]);

  const receiver =
    receiverAddressMode === "custom" &&
    receiverAddressInput &&
    isAddress(receiverAddressInput)
      ? getAddress(receiverAddressInput)
      : defaultReceiver;

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isTokenSelectionOpen, setIsTokenSelectionOpen] = useState(false);

  const isReceiverDifferentFromActiveWallet =
    receiver &&
    receiver !== activeWalletInfo?.activeAccount?.address &&
    (activeWalletInfo?.activeAccount?.address
      ? checksumAddress(receiver) !==
        checksumAddress(activeWalletInfo?.activeAccount?.address)
      : true);

  const tokenQuery = useTokenQuery({
    tokenAddress: props.selectedToken?.tokenAddress,
    chainId: props.selectedToken?.chainId,
    client: props.client,
  });

  const destinationToken =
    tokenQuery.data?.type === "success" ? tokenQuery.data.token : undefined;

  const tokenBalanceQuery = useTokenBalance({
    chainId: props.selectedToken?.chainId,
    tokenAddress: props.selectedToken?.tokenAddress,
    client: props.client,
    walletAddress: activeWalletInfo?.activeAccount?.address,
  });

  const actionLabel = isReceiverDifferentFromActiveWallet ? "Pay" : "Buy";
  const isMobile = useIsMobile();

  // if no receiver address is set - wallet must be connected because the user's wallet is the receiver
  const showConnectButton = !receiver && !activeWalletInfo;

  return (
    <WithHeader
      client={props.client}
      title={props.metadata.title}
      description={props.metadata.description}
      image={props.metadata.image}
    >
      {detailsModalOpen && (
        <DetailsModal
          client={props.client}
          locale={connectLocaleEn}
          detailsModal={{
            hideBuyFunds: true,
          }}
          theme={props.theme}
          closeModal={() => {
            setDetailsModalOpen(false);
          }}
          onDisconnect={() => {
            props.onDisconnect?.();
          }}
          chains={[]}
          connectOptions={props.connectOptions}
        />
      )}

      <Modal
        hide={false}
        className="tw-modal__buy-widget"
        size={isMobile ? "compact" : "wide"}
        title="Select Token"
        open={isTokenSelectionOpen}
        crossContainerStyles={{
          right: spacing.md,
          top: spacing["md+"],
          transform: "none",
        }}
        setOpen={(v) => setIsTokenSelectionOpen(v)}
        autoFocusCrossIcon={false}
      >
        <SelectToken
          type="buy"
          currency={props.currency}
          selections={{
            buyChainId: props.selectedToken?.chainId,
            sellChainId: undefined,
          }}
          activeWalletInfo={activeWalletInfo}
          onClose={() => setIsTokenSelectionOpen(false)}
          client={props.client}
          selectedToken={props.selectedToken}
          setSelectedToken={(token) => {
            props.setSelectedToken(token);
            setIsTokenSelectionOpen(false);
          }}
        />
      </Modal>

      <Container flex="column">
        {/* Token Info */}
        <TokenSection
          title={actionLabel}
          presetOptions={props.presetOptions}
          amountSelection={props.amountSelection}
          setAmount={props.setAmountSelection}
          activeWalletInfo={activeWalletInfo}
          selectedToken={
            props.selectedToken
              ? {
                  data:
                    tokenQuery.data?.type === "success"
                      ? tokenQuery.data.token
                      : undefined,
                  isFetching: tokenQuery.isFetching,
                  isError:
                    tokenQuery.isError ||
                    tokenQuery.data?.type === "unsupported_token",
                }
              : undefined
          }
          balance={{
            data: tokenBalanceQuery.data,
            isFetching: tokenBalanceQuery.isFetching,
          }}
          client={props.client}
          isConnected={!!activeWalletInfo}
          onSelectToken={() => {
            setIsTokenSelectionOpen(true);
          }}
          onWalletClick={() => {
            setDetailsModalOpen(true);
          }}
          currency={props.currency}
          amountEditable={props.amountEditable}
          tokenEditable={props.tokenEditable}
          receiverAddressMode={receiverAddressMode}
          receiverAddress={receiverAddressInput}
          showReceiverDropdown={showReceiverDropdown}
          receiverDropdownRef={receiverDropdownRef}
          onReceiverModeChange={(mode) => {
            setReceiverAddressMode(mode);
            if (mode === "wallet") {
              setReceiverAddressInput("");
            }
          }}
          onReceiverAddressChange={setReceiverAddressInput}
          onShowReceiverDropdownChange={setShowReceiverDropdown}
          onOpenReceiverModal={() => {
            setReceiverAddressModalOpen(true);
            setTempReceiverAddress(receiverAddressInput);
          }}
        />

        {/* Receiver Address Modal */}
        {receiverAddressModalOpen && (
          <Modal
            hide={false}
            autoFocusCrossIcon={false}
            className="tw-modal__receiver-address"
            size="compact"
            title="To Address"
            open={receiverAddressModalOpen}
            setOpen={setReceiverAddressModalOpen}
          >
            <Container flex="column" gap="md" p="md">
              <Container flex="column" gap="xs">
                <Input
                  variant="outline"
                  placeholder="Enter receiver address"
                  value={tempReceiverAddress}
                  onChange={(e) => setTempReceiverAddress(e.target.value)}
                  style={{
                    fontSize: fontSize.sm,
                  }}
                />
                {tempReceiverAddress &&
                  !isAddress(tempReceiverAddress) &&
                  tempReceiverAddress.length > 0 && (
                    <Container
                      style={{
                        padding: spacing.sm,
                        borderRadius: radius.md,
                        backgroundColor: `${theme.colors.danger}15`,
                      }}
                      flex="row"
                      gap="xs"
                      center="y"
                    >
                      <Text size="sm" color="danger">
                        This isn't a valid wallet address. Please ensure that
                        the address provided is accurate.
                      </Text>
                    </Container>
                  )}
                {tempReceiverAddress &&
                  isAddress(tempReceiverAddress) &&
                  activeWalletInfo &&
                  tempReceiverAddress.toLowerCase() ===
                    activeWalletInfo.activeAccount.address.toLowerCase() && (
                    <Container
                      style={{
                        padding: spacing.sm,
                        borderRadius: radius.md,
                        backgroundColor: `${theme.colors.danger}15`,
                      }}
                      flex="row"
                      gap="xs"
                      center="y"
                    >
                      <Text size="sm" color="danger">
                        This is the connected wallet address. Please provide a
                        different address.
                      </Text>
                    </Container>
                  )}
              </Container>

              <Button
                variant="primary"
                fullWidth
                disabled={
                  !tempReceiverAddress ||
                  !isAddress(tempReceiverAddress) ||
                  (activeWalletInfo &&
                    tempReceiverAddress.toLowerCase() ===
                      activeWalletInfo.activeAccount.address.toLowerCase())
                }
                onClick={() => {
                  if (
                    tempReceiverAddress &&
                    isAddress(tempReceiverAddress) &&
                    (!activeWalletInfo ||
                      tempReceiverAddress.toLowerCase() !==
                        activeWalletInfo.activeAccount.address.toLowerCase())
                  ) {
                    setReceiverAddressInput(tempReceiverAddress);
                    setReceiverAddressMode("custom");
                    setReceiverAddressModalOpen(false);
                  }
                }}
              >
                SAVE
              </Button>
            </Container>
          </Modal>
        )}
      </Container>

      <Spacer y="md" />

      {(tokenQuery.isError ||
        tokenQuery.data?.type === "unsupported_token") && (
        <div
          style={{
            border: `1px solid ${theme.colors.borderColor}`,
            borderRadius: radius.full,
            padding: spacing.xs,
            marginBottom: spacing.md,
          }}
        >
          <Text size="sm" color="danger" center>
            Failed to fetch token details
          </Text>
        </div>
      )}

      {/* Continue Button */}
      {showConnectButton ? (
        <ConnectButton
          client={props.client}
          connectButton={{
            label: props.buttonLabel || actionLabel,
            style: {
              width: "100%",
              borderRadius: radius.full,
            },
          }}
          theme={theme}
          {...props.connectOptions}
          autoConnect={false}
          wallets={
            props.connectOptions?.wallets ||
            getDefaultWalletsForBridgeComponents({
              appMetadata: props.connectOptions?.appMetadata,
              chains: props.connectOptions?.chains,
            })
          }
        />
      ) : (
        <Button
          disabled={!receiver}
          fullWidth
          onClick={() => {
            if (!receiver || !destinationToken) {
              return;
            }

            const fiatPricePerToken = destinationToken.prices[props.currency];
            const { tokenValue } = getAmounts(
              props.amountSelection,
              fiatPricePerToken,
            );

            if (!tokenValue) {
              return;
            }

            props.onContinue(
              String(tokenValue),
              destinationToken,
              getAddress(receiver),
            );
          }}
          style={{
            fontSize: fontSize.md,
            borderRadius: radius.full,
          }}
          variant="primary"
        >
          {props.buttonLabel || actionLabel}
        </Button>
      )}

      {props.showThirdwebBranding ? (
        <div>
          <Spacer y="md" />
          <PoweredByThirdweb link="https://playground.thirdweb.com/payments/fund-wallet" />
        </div>
      ) : (
        <Spacer y="xxs" />
      )}
      <Spacer y="md" />
    </WithHeader>
  );
}

function getAmounts(
  amountSelection: AmountSelection,
  fiatPricePerToken: number | undefined,
) {
  const fiatValue =
    amountSelection.type === "usd"
      ? amountSelection.value
      : fiatPricePerToken
        ? fiatPricePerToken * Number(amountSelection.value)
        : undefined;

  const tokenValue =
    amountSelection.type === "token"
      ? amountSelection.value
      : fiatPricePerToken
        ? Number(amountSelection.value) / fiatPricePerToken
        : undefined;

  return {
    fiatValue,
    tokenValue,
  };
}

function TokenSection(props: {
  amountSelection: AmountSelection;
  setAmount: (amountSelection: AmountSelection) => void;
  activeWalletInfo: ActiveWalletInfo | undefined;
  selectedToken:
    | {
        data: TokenWithPrices | undefined;
        isFetching: boolean;
        isError: boolean;
      }
    | undefined;
  currency: SupportedFiatCurrency;
  onSelectToken: () => void;
  client: ThirdwebClient;
  title: string;
  isConnected: boolean;
  balance: {
    data:
      | {
          value: bigint;
          decimals: number;
          symbol: string;
          name: string;
        }
      | undefined;
    isFetching: boolean;
  };
  onWalletClick: () => void;
  presetOptions: [number, number, number];
  amountEditable: boolean;
  tokenEditable: boolean;
  receiverAddressMode?: "wallet" | "custom";
  receiverAddress?: string;
  showReceiverDropdown?: boolean;
  receiverDropdownRef?: React.RefObject<HTMLDivElement | null>;
  onReceiverModeChange?: (mode: "wallet" | "custom") => void;
  onReceiverAddressChange?: (address: string) => void;
  onShowReceiverDropdownChange?: (show: boolean) => void;
  onOpenReceiverModal?: () => void;
}) {
  const theme = useCustomTheme();
  const chainQuery = useBridgeChain({
    chainId: props.selectedToken?.data?.chainId,
    client: props.client,
  });
  const chain = chainQuery.data;
  const fiatPricePerToken = props.selectedToken?.data?.prices[props.currency];

  const { fiatValue, tokenValue } = getAmounts(
    props.amountSelection,
    fiatPricePerToken,
  );

  return (
    <SectionContainer
      header={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Container flex="row" center="y" gap="3xs" color="secondaryText">
            <Text
              size="xs"
              color="primaryText"
              style={{
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              {props.title}
            </Text>
          </Container>
          {props.activeWalletInfo && props.receiverAddressMode ? (
            <div
              ref={props.receiverDropdownRef}
              style={{
                position: "relative",
              }}
            >
              <Button
                variant="ghost-solid"
                onClick={() =>
                  props.onShowReceiverDropdownChange?.(
                    !props.showReceiverDropdown,
                  )
                }
                style={{
                  padding: `${spacing.xxs} 2px`,
                  fontSize: fontSize.xs,
                  fontWeight: 400,
                }}
              >
                {props.receiverAddressMode === "wallet"
                  ? shortenAddress(props.activeWalletInfo.activeAccount.address)
                  : props.receiverAddress && isAddress(props.receiverAddress)
                    ? shortenAddress(props.receiverAddress)
                    : "Select wallet"}
                <span style={{ marginLeft: spacing.xxs }} />
                <span
                  style={{
                    transform: props.showReceiverDropdown
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 200ms ease",
                    display: "inline-flex",
                  }}
                >
                  <ArrowUpDownIcon size={iconSize.xs} />
                </span>
              </Button>

              {props.showReceiverDropdown && (
                <Container
                  bg="modalBg"
                  style={{
                    borderRadius: radius.md,
                    border: `1px solid ${theme.colors.borderColor}`,
                    padding: spacing.xs,
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    marginTop: spacing.xs,
                    zIndex: 1000,
                    minWidth: "200px",
                    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
                    overflow: "visible",
                  }}
                >
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      props.onReceiverModeChange?.("wallet");
                      props.onReceiverAddressChange?.("");
                      props.onShowReceiverDropdownChange?.(false);
                    }}
                    style={{
                      justifyContent: "flex-start",
                      padding: spacing.sm,
                      fontSize: fontSize.sm,
                    }}
                  >
                    Use connected wallet
                  </Button>
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      props.onShowReceiverDropdownChange?.(false);
                      props.onOpenReceiverModal?.();
                    }}
                    style={{
                      justifyContent: "flex-start",
                      padding: spacing.sm,
                      fontSize: fontSize.sm,
                      borderTop: `1px solid ${theme.colors.borderColor}`,
                      marginTop: spacing.xs,
                      paddingTop: spacing.sm,
                    }}
                  >
                    Paste wallet address
                  </Button>
                </Container>
              )}
            </div>
          ) : props.activeWalletInfo ? (
            <ActiveWalletDetails
              activeWalletInfo={props.activeWalletInfo}
              client={props.client}
              onClick={props.onWalletClick}
            />
          ) : null}
        </div>
      }
    >
      {/* select token */}
      <SelectedTokenButton
        selectedToken={props.selectedToken}
        client={props.client}
        onSelectToken={props.onSelectToken}
        chain={chain}
        disabled={props.tokenEditable === false}
      />

      <Container px="md" py="md">
        {/* token value input */}
        <DecimalInput
          value={tokenValue ? String(tokenValue) : ""}
          setValue={(value) => {
            props.setAmount({
              type: "token",
              value,
            });
          }}
          disabled={props.amountEditable === false}
          style={{
            border: "none",
            boxShadow: "none",
            fontSize: fontSize.xl,
            fontWeight: 500,
            paddingInline: 0,
            paddingBlock: 0,
            letterSpacing: "-0.025em",
          }}
        />

        <Spacer y="xs" />

        {/* fiat value input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <Text
            size="md"
            color="secondaryText"
            style={{
              flexShrink: 0,
            }}
          >
            {getFiatSymbol(props.currency)}
          </Text>

          {props.selectedToken?.isFetching ? (
            <Skeleton
              width="120px"
              height="20px"
              style={{
                transform: "translateX(4px)",
              }}
            />
          ) : (
            <DecimalInput
              value={String(fiatValue || 0)}
              setValue={(value) => {
                props.setAmount({
                  type: "usd",
                  value,
                });
              }}
              disabled={props.amountEditable === false}
              style={{
                border: "none",
                boxShadow: "none",
                fontSize: fontSize.md,
                fontWeight: 400,
                color: theme.colors.secondaryText,
                paddingInline: 0,
                height: "20px",
                paddingBlock: 0,
              }}
            />
          )}
        </div>

        {/* suggested amounts */}
        {props.amountEditable && (
          <>
            <Spacer y="md" />
            <Container flex="row" gap="xxs">
              {props.presetOptions.map((amount) => (
                <Button
                  disabled={
                    !props.selectedToken?.data || props.amountEditable === false
                  }
                  key={amount}
                  onClick={() =>
                    props.setAmount({
                      type: "usd",
                      value: String(amount),
                    })
                  }
                  style={{
                    backgroundColor: "transparent",
                    color: theme.colors.secondaryText,
                    fontSize: fontSize.xs,
                    fontWeight: 400,
                    borderRadius: radius.full,
                    gap: "0.5px",
                    padding: `${spacing.xxs} ${spacing.sm}`,
                  }}
                  variant="outline"
                >
                  <span>{getFiatSymbol(props.currency)}</span>
                  <span>{amount}</span>
                </Button>
              ))}
            </Container>
          </>
        )}
      </Container>

      {/* balance */}
      {props.isConnected && props.selectedToken && (
        <Container
          px="md"
          py="md"
          style={{
            borderTop: `1px dashed ${theme.colors.borderColor}`,
            justifyContent: "start",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <Text size="xs" color="secondaryText">
              Current Balance
            </Text>
            {props.balance.data === undefined ? (
              <Skeleton height={fontSize.xs} width="100px" />
            ) : (
              <Text size="xs" color="primaryText">
                {formatTokenAmount(
                  props.balance.data.value,
                  props.balance.data.decimals,
                  5,
                )}{" "}
                {props.balance.data.symbol}
              </Text>
            )}
          </div>
        </Container>
      )}
    </SectionContainer>
  );
}

function SectionContainer(props: {
  children: React.ReactNode;
  header: React.ReactNode;
}) {
  const theme = useCustomTheme();
  return (
    <Container
      style={{
        borderRadius: radius.xl,
        borderWidth: 1,
        borderStyle: "solid",
        position: "relative",
        overflow: "visible",
      }}
      borderColor="borderColor"
    >
      {/* make the background semi-transparent */}
      <Container
        bg="tertiaryBg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          zIndex: 0,
          borderRadius: radius.xl,
          overflow: "hidden",
        }}
      />

      {/* header */}
      <Container
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "visible",
        }}
      >
        <Container px="md" py="sm" relative style={{ overflow: "visible" }}>
          {props.header}
        </Container>
      </Container>

      {/* content */}
      <Container
        bg="tertiaryBg"
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: radius.xl,
          borderTop: `1px solid ${theme.colors.borderColor}`,
        }}
      >
        {props.children}
      </Container>
    </Container>
  );
}
