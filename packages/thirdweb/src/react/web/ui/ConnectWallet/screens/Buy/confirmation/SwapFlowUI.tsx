import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import {
  iconSize,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import {
  PartialSuccessMessage,
  StepContainer,
  Stepper,
  TokenInfo,
  TxHashLink,
  WithSwitchNetworkButton,
} from "./common.js";

export type SwapFlowUIProps = {
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
        activeStep: "approve" | "swap" | "sendTx";
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
        activeStep: "swap";
        status: "partialSuccess";
        data: {
          // unexpected token and amount
          token: ERC20OrNativeToken;
          amount: string;
        };
      };

  activeChain: Chain;
  onSwapClick: () => void;
  client: ThirdwebClient;
  estimatedTimeToSwap: string;
};

export function SwapFlowUI(props: SwapFlowUIProps) {
  const swapStep = props.approvalRequired ? 2 : 1;
  const purchaseStep = swapStep + 1;
  const onlySwapRequired = !props.txInfo && !props.approvalRequired;

  const modalTitle =
    props.state.activeStep === "done"
      ? "Purchased successfully"
      : props.state.activeStep === "swap" &&
          props.state.status === "partialSuccess"
        ? "Incomplete"
        : "Confirm Purchase";

  return (
    <Container>
      <Container p="lg">
        <ModalHeader onBack={props.onBack || undefined} title={modalTitle} />
      </Container>
      <Line />
      <Container p="lg">
        {onlySwapRequired ? (
          <Container>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: spacing.md,
              }}
            >
              <Text>Purchase</Text>

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
                gap: spacing.lg,
                alignItems: "flex-start",
                paddingBlock: spacing.md,
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
                <Text>Time</Text>

                <Text size="md" color="primaryText">
                  {props.estimatedTimeToSwap}
                </Text>
              </div>

              <Line />
            </div>
            <Spacer y="lg" />
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
                      {formatNumber(Number(props.from.amount), 4)}{" "}
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
                        {formatNumber(Number(props.txInfo.cost.amount), 3)}{" "}
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
        {props.state.activeStep === "swap" &&
          props.state.status !== "partialSuccess" && (
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
              {props.state.activeStep === "approve"
                ? "approve"
                : props.state.activeStep === "swap"
                  ? "swap"
                  : "purchase"}
              , Please try again
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

        {/* Estimated time */}
        {!onlySwapRequired &&
          (props.state.status === "idle" || props.state.status === "pending") &&
          props.state.activeStep === "swap" &&
          props.activeChain === props.from.chain && (
            <>
              <Spacer y="md" />
              <Text color="accentText" center size="sm">
                Estimated time: {props.estimatedTimeToSwap}
              </Text>
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
