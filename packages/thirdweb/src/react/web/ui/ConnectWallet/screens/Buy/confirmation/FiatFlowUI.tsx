import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import {
  iconSize,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import type { CurrencyMeta } from "../fiat/currencies.js";
import {
  PartialSuccessMessage,
  StepContainer,
  Stepper,
  TokenInfo,
  TxHashLink,
  WithSwitchNetworkButton,
} from "./common.js";

export type FiatFlowUIProps = {
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
  swapRequired: {
    swapFrom: {
      token: ERC20OrNativeToken;
      chain: Chain;
      amount: string;
    };
    approvalRequired: {
      onApproveClick: () => void;
    } | null;
    onSwapClick: () => void;
    estimatedTimeToSwap: string | null;
    refetchSwapQuote: () => void;
  } | null;
  fiatFrom: {
    currency: CurrencyMeta;
    amount: string;
  };
  to: {
    token: ERC20OrNativeToken;
    chain: Chain;
    amount: string;
  };
  state:
    | {
        activeStep: "onramp" | "approve" | "swap" | "sendTx";
        status: "pending" | "idle" | "error";
      }
    | {
        activeStep: "done";
        status: "idle";
        data: {
          txHash: string;
        };
      }
    | {
        activeStep: "swap" | "approve";
        status: "fetching-quote" | "quote-fetch-error";
      }
    | {
        activeStep: "swap";
        status: "partialSuccess";
        data: {
          // unexpected token and amount
          token: ERC20OrNativeToken;
          amount: string;
        };
      };
  activeChain: Chain;
  onOnrampClick: () => void;
  client: ThirdwebClient;
  estimatedTimeToOnramp: string;
};

export function FiatFlowUI(props: FiatFlowUIProps) {
  const swapStep = props.swapRequired
    ? props.swapRequired.approvalRequired
      ? 3
      : 2
    : -1;
  const purchaseStep = props.swapRequired ? swapStep + 1 : 2;
  const onlyOnrampRequired = !props.swapRequired && !props.txInfo;

  const modalTitle =
    props.state.activeStep === "done"
      ? "Purchased successfully"
      : props.state.status === "partialSuccess"
        ? "Incomplete"
        : "Confirm Purchase";

  return (
    <Container>
      <Container p="lg">
        <ModalHeader onBack={props.onBack || undefined} title={modalTitle} />
      </Container>
      <Line />
      <Container p="lg">
        {onlyOnrampRequired ? (
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

                <Container flex="row" gap="xs" center="y">
                  <Text color="primaryText">
                    {props.fiatFrom.amount} {props.fiatFrom.currency.shorthand}
                  </Text>
                  <props.fiatFrom.currency.icon size={iconSize.sm} />
                </Container>
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

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBlock: spacing.md,
                }}
              >
                <Text>Time</Text>

                <Text size="md" color="primaryText">
                  {props.estimatedTimeToOnramp}
                </Text>
              </div>

              <Line />
            </div>
            <Spacer y="xxl" />
          </Container>
        ) : (
          <StepContainer>
            {/* OnRamp */}
            <Stepper
              step={1}
              isActive={props.state.activeStep === "onramp"}
              isDone={props.state.activeStep !== "onramp"}
              content={
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <Text color="primaryText" size="md">
                    Buy {/* Onramp token / final token */}
                    <TokenSymbol
                      chain={
                        props.swapRequired?.swapFrom.chain || props.to.chain
                      }
                      token={
                        props.swapRequired?.swapFrom.token || props.to.token
                      }
                      size="md"
                      color="primaryText"
                      inline
                    />{" "}
                  </Text>
                  <Spacer y="sm" />
                  <div
                    style={{
                      display: "flex",
                      gap: spacing.sm,
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <Text size="sm" color="primaryText">
                        {props.fiatFrom.amount}{" "}
                        {props.fiatFrom.currency.shorthand}
                      </Text>
                      <Spacer y="xxs" />
                      <Container flex="row" gap="xxs" center="y">
                        <props.fiatFrom.currency.icon size={iconSize.xs} />
                        <Text size="xs">{props.fiatFrom.currency.name}</Text>
                      </Container>
                    </div>

                    <Container color="secondaryText" flex="row" center="both">
                      <DoubleArrowRightIcon
                        width={iconSize.xs}
                        height={iconSize.xs}
                      />
                    </Container>

                    <TokenInfo
                      client={props.client}
                      token={
                        props.swapRequired?.swapFrom.token || props.to.token
                      }
                      chain={
                        props.swapRequired?.swapFrom.chain || props.to.chain
                      }
                      amount={
                        props.swapRequired?.swapFrom.amount || props.to.amount
                      }
                      amountSize="sm"
                      chainNameSize="xs"
                      iconSize="xs"
                      align="left"
                    />
                  </div>
                </div>
              }
            />

            {/* Approve Spending */}
            {props.swapRequired?.approvalRequired && (
              <Stepper
                step={2}
                isActive={props.state.activeStep === "approve"}
                isDone={
                  props.state.activeStep !== "onramp" &&
                  props.state.activeStep !== "approve"
                }
                content={
                  <div>
                    {/* Title */}
                    <Text size="md" color="primaryText">
                      Approve Spending
                    </Text>
                    <Spacer y="xs" />
                    <Text size="sm" color="secondaryText">
                      {props.swapRequired.swapFrom.amount}{" "}
                      <TokenSymbol
                        chain={props.swapRequired.swapFrom.chain}
                        size="sm"
                        token={props.swapRequired.swapFrom.token}
                        color="secondaryText"
                        inline
                      />
                    </Text>
                  </div>
                }
              />
            )}

            {/* Swap  */}
            {props.swapRequired && (
              <Stepper
                step={swapStep}
                isActive={props.state.activeStep === "swap"}
                isDone={
                  props.state.activeStep === "sendTx" ||
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
                        token={props.swapRequired.swapFrom.token}
                        chain={props.swapRequired.swapFrom.chain}
                        amount={props.swapRequired.swapFrom.amount}
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
            )}

            {/* Purchase   */}
            {props.txInfo && (
              <Stepper
                isActive={props.state.activeStep === "sendTx"}
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

        {/* onramp Tx Button */}
        {props.state.activeStep === "onramp" && (
          <Button
            fullWidth
            variant="accent"
            gap="xs"
            onClick={props.onOnrampClick}
          >
            {props.state.status === "pending" ? (
              <>
                Purchasing
                <Spinner size="sm" color="accentButtonText" />
              </>
            ) : (
              "Purchase"
            )}
          </Button>
        )}

        {props.state.status === "fetching-quote" && props.swapRequired ? (
          <Button variant="outline" disabled aria-disabled gap="xs" fullWidth>
            Refreshing Quote
            <Spinner size="sm" color="accentText" />
          </Button>
        ) : props.state.status === "quote-fetch-error" && props.swapRequired ? (
          <>
            <Button
              variant="accent"
              gap="xs"
              fullWidth
              onClick={props.swapRequired.refetchSwapQuote}
            >
              Try again
            </Button>
            <Spacer y="md" />
            <Text color="danger" center size="sm">
              Failed to refresh quote
            </Text>
          </>
        ) : (
          <>
            {/* Approve Button */}
            {props.state.activeStep === "approve" &&
              props.swapRequired?.approvalRequired && (
                <WithSwitchNetworkButton
                  activeChain={props.activeChain}
                  isLoading={props.state.status === "pending"}
                  label="Approve"
                  loadingLabel="Approving"
                  onClick={props.swapRequired.approvalRequired.onApproveClick}
                  targetChain={props.swapRequired.swapFrom.chain}
                />
              )}

            {/* Swap Button */}
            {props.state.activeStep === "swap" &&
              props.swapRequired &&
              props.state.status !== "partialSuccess" && (
                <WithSwitchNetworkButton
                  activeChain={props.activeChain}
                  isLoading={props.state.status === "pending"}
                  label="Swap"
                  loadingLabel="Swapping"
                  onClick={props.swapRequired.onSwapClick}
                  targetChain={props.swapRequired.swapFrom.chain}
                />
              )}
          </>
        )}

        {/* Execute Tx Button */}
        {props.state.activeStep === "sendTx" && props.txInfo && (
          <WithSwitchNetworkButton
            activeChain={props.activeChain}
            isLoading={props.state.status === "pending"}
            label="Purchase"
            loadingLabel="Purchasing"
            onClick={props.txInfo.onSendTxClick}
            targetChain={props.txInfo.cost.chain}
          />
        )}

        {/* Error Messages */}
        {props.state.status === "error" && (
          <>
            <Spacer y="md" />
            <Text color="danger" center size="sm">
              Failed to{" "}
              {props.state.activeStep === "onramp"
                ? "purchase"
                : props.state.activeStep === "approve"
                  ? "approve"
                  : props.state.activeStep === "swap"
                    ? "swap"
                    : "purchase"}
              , Please try again
            </Text>
          </>
        )}

        {/* Estimated time - onramp */}
        {!onlyOnrampRequired &&
          (props.state.status === "pending" || props.state.status === "idle") &&
          props.state.activeStep === "onramp" && (
            <>
              <Spacer y="md" />
              <Text color="accentText" center size="sm">
                Estimated time: {props.estimatedTimeToOnramp}
              </Text>
            </>
          )}

        {/* Estimated time - swap */}
        {props.swapRequired &&
          (props.state.status === "idle" || props.state.status === "pending") &&
          props.state.activeStep === "swap" &&
          props.swapRequired.swapFrom.chain === props.activeChain &&
          props.swapRequired.estimatedTimeToSwap !== null && (
            <>
              <Spacer y="md" />
              <Text color="accentText" center size="sm">
                Estimated time {props.swapRequired.estimatedTimeToSwap}
              </Text>
            </>
          )}

        {/* Partial Sucess  */}
        {props.state.activeStep === "swap" &&
          props.state.status === "partialSuccess" && (
            <>
              <Spacer y="md" />
              <PartialSuccessMessage
                chain={props.to.chain}
                expected={{
                  amount: props.to.amount,
                  token: props.to.token,
                }}
                got={{
                  amount: props.state.data.amount,
                  token: props.state.data.token,
                }}
              />
            </>
          )}

        {/* Tx hash */}
        {props.state.activeStep === "done" && (
          <TxHashLink chain={props.to.chain} txHash={props.state.data.txHash} />
        )}
      </Container>
    </Container>
  );
}
