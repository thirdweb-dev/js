/** biome-ignore-all lint/a11y/useSemanticElements: FIXME */
"use client";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
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
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  type Theme,
} from "../../../core/design-system/index.js";
import { useEnsName } from "../../../core/utils/wallet.js";
import { ConnectButton } from "../ConnectWallet/ConnectButton.js";
import { DetailsModal } from "../ConnectWallet/Details.js";
import { WalletDotIcon } from "../ConnectWallet/icons/WalletDotIcon.js";
import connectLocaleEn from "../ConnectWallet/locale/en.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import { formatTokenAmount } from "../ConnectWallet/screens/formatTokenBalance.js";
import { Container } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { CopyIcon } from "../components/CopyIcon.js";
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
import { useBridgeChains } from "./swap-widget/use-bridge-chains.js";

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
  const receiver =
    props.receiverAddress ?? activeWalletInfo?.activeAccount?.address;

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isTokenSelectionOpen, setIsTokenSelectionOpen] = useState(false);

  const isReceiverDifferentFromActiveWallet =
    props.receiverAddress &&
    isAddress(props.receiverAddress) &&
    (activeWalletInfo?.activeAccount?.address
      ? checksumAddress(props.receiverAddress) !==
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
  const showConnectButton = !props.receiverAddress && !activeWalletInfo;

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
        />

        {receiver && isReceiverDifferentFromActiveWallet && (
          <>
            <ArrowSection />
            <ReceiverWalletSection address={receiver} client={props.client} />
          </>
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
}) {
  const theme = useCustomTheme();
  const chainQuery = useBridgeChains(props.client);
  const chain = chainQuery.data?.find(
    (chain) => chain.chainId === props.selectedToken?.data?.chainId,
  );

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
          {props.activeWalletInfo && (
            <ActiveWalletDetails
              activeWalletInfo={props.activeWalletInfo}
              client={props.client}
              onClick={props.onWalletClick}
            />
          )}
        </div>
      }
    >
      {/* select token */}
      <SelectedTokenButton
        selectedToken={props.selectedToken}
        client={props.client}
        onSelectToken={props.onSelectToken}
        chain={chain}
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

        <Spacer y="md" />

        {/* suggested amounts */}
        <Container flex="row" gap="xxs">
          {props.presetOptions.map((amount) => (
            <Button
              disabled={!props.selectedToken?.data}
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

function ReceiverWalletSection(props: {
  address: string;
  client: ThirdwebClient;
}) {
  const ensNameQuery = useEnsName({
    address: props.address,
    client: props.client,
  });

  return (
    <SectionContainer
      header={
        <Text
          size="xs"
          color="primaryText"
          style={{
            letterSpacing: "0.07em",
            textTransform: "uppercase",
          }}
        >
          To
        </Text>
      }
    >
      <Container
        px="md"
        py="md"
        flex="row"
        center="y"
        gap="xs"
        color="secondaryText"
      >
        <WalletDotIcon size={iconSize.xs} color="secondaryText" />
        <Text size="sm" color="primaryText">
          {ensNameQuery.data || shortenAddress(props.address)}
        </Text>
        <CopyIcon text={props.address} tip="Copy address" iconSize={14} />
      </Container>
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
        overflow: "hidden",
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
        }}
      />

      {/* header */}
      <Container
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container px="md" py="sm" relative>
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

function ArrowSection() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBlock: `-13px`,
        zIndex: 2,
        position: "relative",
      }}
    >
      <Container
        p="xs"
        center="both"
        flex="row"
        color="primaryText"
        bg="modalBg"
        borderColor="borderColor"
        style={{
          borderRadius: radius.full,
          borderWidth: 1,
          borderStyle: "solid",
        }}
      >
        <ArrowDownIcon width={iconSize["sm+"]} height={iconSize["sm+"]} />
      </Container>
    </div>
  );
}
