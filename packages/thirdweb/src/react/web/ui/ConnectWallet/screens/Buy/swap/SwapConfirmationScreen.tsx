import {
  CheckIcon,
  DoubleArrowRightIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { ChainName } from "../../../../components/ChainName.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { SwitchNetworkButton } from "../../../../components/SwitchNetwork.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";

export type SwapConfirmationScreenUIProps = {
  onBack: null | (() => void);
  txInfo: {
    label: string;
    cost: {
      amount: string;
      token: ERC20OrNativeToken;
      chain: Chain;
    };
    onSendTxClick: () => void;
  } | null;
  approvalRequired: {
    onApproveClick: () => void;
  } | null;
  from: {
    token: ERC20OrNativeToken;
    chain: Chain;
    amount: string;
  };
  to: {
    token: ERC20OrNativeToken;
    chain: Chain;
    amount: string;
  };
  state:
    | {
        activeStep: "approve" | "swap" | "purchase";
        status: "pending" | "idle" | "error";
      }
    | {
        activeStep: "done";
        status: "idle";
        data: {
          chain: Chain;
          txHash: string;
        };
      };
  activeChain: Chain;
  onSwapClick: () => void;
  client: ThirdwebClient;
  estimatedTimeToSwap: string;
};

export function SwapConfirmationScreenUI(props: SwapConfirmationScreenUIProps) {
  const swapStep = props.approvalRequired ? 2 : 1;
  const purchaseStep = swapStep + 1;
  const onlySwapRequired = !props.txInfo && !props.approvalRequired;

  const modalTitle =
    props.state.activeStep === "done"
      ? "Purchased successfully"
      : "Confirm Purchase";

  return (
    <Container>
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={modalTitle} />
      </Container>
      <Line />

      <Container p="lg">
        {onlySwapRequired ? (
          <Container>
            <div
              style={{
                gap: spacing.lg,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: spacing.md,
                }}
              >
                <Text>Pay</Text>
                <TokenInfo
                  client={props.client}
                  token={props.from.token}
                  chain={props.from.chain}
                  amount={props.from.amount}
                  amountSize="sm"
                  chainNameSize="xs"
                  iconSize="xs"
                  align="right"
                />
              </div>

              <Line />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBlock: spacing.md,
                }}
              >
                <Text>Receive</Text>

                <TokenInfo
                  client={props.client}
                  token={props.to.token}
                  chain={props.to.chain}
                  amount={props.to.amount}
                  amountSize="sm"
                  chainNameSize="xs"
                  iconSize="xs"
                  align="right"
                />
              </div>

              <Line />
            </div>
            <Spacer y="xxl" />
          </Container>
        ) : (
          <StepContainer>
            {/* Approve Spending */}
            {props.approvalRequired && (
              <Stepper
                step={1}
                isActive={props.state.activeStep === "approve"}
                isDone={props.state.activeStep !== "approve"}
                content={
                  <div>
                    {/* Title */}
                    <Text size="md" color="primaryText">
                      Approve Spending
                    </Text>
                    <Spacer y="xs" />
                    <Text size="sm" color="secondaryText">
                      {props.from.amount}{" "}
                      <TokenSymbol
                        chain={props.from.chain}
                        size="sm"
                        token={props.from.token}
                        color="secondaryText"
                        inline
                      />
                    </Text>
                  </div>
                }
              />
            )}

            {/* Swap  */}
            <Stepper
              step={swapStep}
              isActive={props.state.activeStep === "swap"}
              isDone={
                props.state.activeStep === "purchase" ||
                props.state.activeStep === "done"
              }
              content={
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <Text color="primaryText" size="md">
                    Swap
                  </Text>
                  <Spacer y="sm" />
                  <div
                    style={{
                      display: "flex",
                      gap: spacing.sm,
                      alignItems: "flex-start",
                    }}
                  >
                    <TokenInfo
                      client={props.client}
                      token={props.from.token}
                      chain={props.from.chain}
                      amount={props.from.amount}
                      amountSize="sm"
                      chainNameSize="xs"
                      iconSize="xs"
                      align="left"
                    />

                    <Container color="secondaryText" flex="row" center="both">
                      <DoubleArrowRightIcon
                        width={iconSize.xs}
                        height={iconSize.xs}
                      />
                    </Container>

                    <TokenInfo
                      client={props.client}
                      token={props.to.token}
                      chain={props.to.chain}
                      amount={props.to.amount}
                      amountSize="sm"
                      chainNameSize="xs"
                      iconSize="xs"
                      align="left"
                    />
                  </div>
                </div>
              }
            />

            {/* Purchase   */}
            {props.txInfo && (
              <Stepper
                isActive={props.state.activeStep === "purchase"}
                isDone={props.state.activeStep === "done"}
                step={purchaseStep}
                content={
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <Text color="primaryText" size="md">
                      Purchase
                    </Text>
                    <Spacer y="xxs" />
                    <Container
                      flex="row"
                      center="y"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <Text size="md" color="primaryText" multiline>
                        {props.txInfo.label}
                      </Text>

                      <Text
                        size="sm"
                        color="secondaryText"
                        style={{
                          flexShrink: 0,
                        }}
                      >
                        {props.txInfo.cost.amount}{" "}
                        <TokenSymbol
                          chain={props.txInfo.cost.chain}
                          size="sm"
                          token={props.txInfo.cost.token}
                          color="secondaryText"
                          inline
                        />
                      </Text>
                    </Container>
                  </div>
                }
              />
            )}
          </StepContainer>
        )}

        {/* Approve Button */}
        {props.state.activeStep === "approve" && props.approvalRequired && (
          <WithSwitchNetworkButton
            activeChain={props.activeChain}
            isLoading={props.state.status === "pending"}
            label="Approve"
            loadingLabel="Approving"
            onClick={props.approvalRequired.onApproveClick}
            targetChain={props.from.chain}
          />
        )}

        {/* Swap Button */}
        {props.state.activeStep === "swap" && (
          <WithSwitchNetworkButton
            activeChain={props.activeChain}
            isLoading={props.state.status === "pending"}
            label="Swap"
            loadingLabel="Swapping"
            onClick={props.onSwapClick}
            targetChain={props.from.chain}
          />
        )}

        {/* Execute Tx Button */}
        {props.state.activeStep === "purchase" && props.txInfo && (
          <WithSwitchNetworkButton
            activeChain={props.activeChain}
            isLoading={props.state.status === "pending"}
            label="Purchase"
            loadingLabel="Purchasing"
            onClick={props.txInfo.onSendTxClick}
            targetChain={props.from.chain}
          />
        )}

        {/* Error Messages */}
        {props.state.status === "error" && (
          <>
            <Spacer y="md" />
            <Text color="danger" center size="sm">
              Failed to{" "}
              {props.state.activeStep === "approve"
                ? "approve"
                : props.state.activeStep === "swap"
                  ? "swap"
                  : "purchase"}
              , Please try again
            </Text>
          </>
        )}

        {/* Estimated time */}
        {props.state.status !== "error" &&
          props.state.activeStep === "swap" &&
          props.activeChain === props.from.chain && (
            <>
              <Spacer y="md" />
              <Text color="accentText" center size="sm">
                Estimated time {props.estimatedTimeToSwap}
              </Text>
            </>
          )}

        {/* Tx hash */}
        {props.state.activeStep === "done" && (
          <TxHashLink
            chain={props.state.data.chain}
            txHash={props.state.data.txHash}
          />
        )}
      </Container>
    </Container>
  );
}

function TxHashLink(props: {
  txHash: string;
  chain: Chain;
}) {
  const doneTxChainQuery = useChainQuery(props.chain);

  const explorerLink = doneTxChainQuery.data?.explorers?.[0]?.url;

  if (!explorerLink) {
    return null;
  }

  return (
    <Button
      fullWidth
      variant="outline"
      onClick={() => {
        window.open(`${explorerLink}/tx/${props.txHash}`, "_blank");
      }}
      gap="xs"
    >
      View on Explorer
      <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
    </Button>
  );
}

function WithSwitchNetworkButton(props: {
  targetChain: Chain;
  activeChain: Chain;
  onClick: () => void;
  label: string;
  loadingLabel: string;
  isLoading: boolean;
}) {
  if (props.targetChain === props.activeChain) {
    return (
      <Button fullWidth variant="accent" gap="xs">
        {props.isLoading ? (
          <>
            {props.loadingLabel}
            <Spinner size="sm" color="accentButtonText" />
          </>
        ) : (
          props.label
        )}
      </Button>
    );
  }

  return (
    <SwitchNetworkButton
      variant="secondary"
      fullWidth
      chain={props.targetChain}
    />
  );
}

function Stepper(props: {
  step: number;
  content: React.ReactNode;
  isActive: boolean;
  isDone: boolean;
}) {
  return (
    <div
      data-step
      data-active={props.isActive}
      style={{
        display: "flex",
        gap: spacing.sm,
        position: "relative",
        paddingBottom: spacing.md,
      }}
    >
      <StepCircle data-active={props.isActive} data-done={props.isDone}>
        {props.isDone ? (
          <CheckIcon
            style={{
              width: fontSize.md,
              height: fontSize.md,
            }}
          />
        ) : (
          props.step
        )}
      </StepCircle>

      <div
        data-content
        style={{
          flex: 1,
          paddingBottom: spacing.md,
          opacity: props.isActive || props.isDone ? 1 : 0.5,
        }}
      >
        {props.content}
      </div>
      <StepperLine data-stepline />
    </div>
  );
}

const StepContainer = StyledDiv({
  "& [data-step]:last-child [data-stepline]": {
    display: "none",
  },
});

const stepCircleSize = 24;

const StepperLine = StyledDiv((_p) => {
  const theme = useCustomTheme();
  return {
    width: "1px",
    height: "100%",
    left: `${stepCircleSize / 2}px`,
    backgroundColor: theme.colors.borderColor,
    position: "absolute",
    zIndex: 0,
  };
});

const StepCircle = StyledDiv((_p) => {
  const theme = useCustomTheme();
  return {
    width: `${stepCircleSize}px`,
    height: `${stepCircleSize}px`,
    flexShrink: 0,
    borderRadius: "50%",
    border: `1px solid ${theme.colors.borderColor}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: fontSize.sm,
    marginTop: "-1.5px",
    backgroundColor: theme.colors.tertiaryBg,
    position: "relative",
    zIndex: 1,
    fontWeight: 500,
    '&[data-active="true"]': {
      background: theme.colors.accentButtonBg,
      borderColor: theme.colors.accentButtonBg,
      color: theme.colors.accentButtonText,
    },
    '&[data-done="true"]': {
      color: theme.colors.success,
      borderColor: theme.colors.success,
      background: theme.colors.modalBg,
    },
  };
});

function TokenInfo(props: {
  chain: Chain;
  token: ERC20OrNativeToken;
  amount: string;
  client: ThirdwebClient;
  amountSize: keyof typeof fontSize;
  chainNameSize: keyof typeof fontSize;
  iconSize: keyof typeof iconSize;
  align: "left" | "right";
}) {
  return (
    <Container
      flex="row"
      gap="xs"
      center="y"
      style={{
        flexWrap: "nowrap",
      }}
    >
      <Container
        flex="column"
        gap="xxs"
        style={{
          alignItems: props.align === "right" ? "flex-end" : "flex-start",
        }}
      >
        <Container flex="row" gap="xxs">
          <Text size={props.amountSize} color="primaryText">
            {props.amount}
          </Text>
          <TokenSymbol
            chain={props.chain}
            size={props.amountSize}
            token={props.token}
            color="primaryText"
            inline
          />
        </Container>
        <Container flex="row" gap="xxs">
          <TokenIcon
            token={props.token}
            size={props.iconSize}
            chain={props.chain}
            client={props.client}
          />
          <ChainName
            chain={props.chain}
            size={props.chainNameSize}
            client={props.client}
            short
          />
        </Container>
      </Container>
    </Container>
  );
}
