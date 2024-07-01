import { ethereum } from "../../../chains/chain-definitions/ethereum.js";
import { polygon } from "../../../chains/chain-definitions/polygon.js";
import {
  SwapFlowUI,
  type SwapFlowUIProps,
} from "../../../react/web/ui/ConnectWallet/screens/Buy/confirmation/SwapFlowUI.js";
import {
  Row,
  StoryScreenTitle,
  noop,
  storyClient,
  usdcPolygon,
  usdtPolygon,
} from "../../utils.js";
import { ScreenContainer } from "../ScreenContainer.js";

export function SwapFlowStory(props: {
  theme: "dark" | "light";
}) {
  return (
    <div>
      <Row>
        <SwapOnly theme={props.theme} />
        <SwapAndApprove theme={props.theme} />
        <SwapApproveTx theme={props.theme} />
        <SwapAndTx theme={props.theme} />
      </Row>
    </div>
  );
}

function SwapOnly(props: {
  theme: "dark" | "light";
}) {
  const generalProps: SwapFlowUIProps = {
    onBack: noop,
    approvalRequired: null,
    txInfo: null,
    from: {
      amount: "8.8432",
      chain: polygon,
      token: { nativeToken: true },
    },
    to: {
      amount: "5.0276",
      chain: polygon,
      token: usdcPolygon,
    },
    onSwapClick: noop,
    state: {
      activeStep: "swap",
      status: "idle",
    },
    activeChain: polygon,
    client: storyClient,
    estimatedTimeToSwap: "~20s",
  };

  return (
    <div>
      <StoryScreenTitle label="1 step Swap" large />

      <ScreenContainer theme={props.theme} label="Swap">
        <SwapFlowUI {...generalProps} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap (Switch Required)">
        <SwapFlowUI {...generalProps} activeChain={ethereum} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swapping">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap Failed">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Partial Success">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "partialSuccess",
            data: {
              token: usdtPolygon,
              amount: "5.5",
            },
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Done">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "done",
            status: "idle",
            data: {
              txHash: "0x1234567890",
            },
          }}
        />
      </ScreenContainer>
    </div>
  );
}

function SwapAndApprove(props: {
  theme: "dark" | "light";
}) {
  const generalProps: SwapFlowUIProps = {
    onBack: noop,
    txInfo: null,
    from: {
      amount: "8.8432",
      chain: polygon,
      token: { nativeToken: true },
    },
    to: {
      amount: "5.0276",
      chain: polygon,
      token: usdcPolygon,
    },
    onSwapClick: noop,
    activeChain: polygon,
    approvalRequired: {
      onApproveClick: noop,
    },
    state: {
      activeStep: "approve",
      status: "idle",
    },
    client: storyClient,
    estimatedTimeToSwap: "~20s",
  };

  return (
    <div>
      <StoryScreenTitle label="2 step Swap" large />

      <ScreenContainer theme={props.theme} label="Approve">
        <SwapFlowUI {...generalProps} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approve (Switch Required)">
        <SwapFlowUI {...generalProps} activeChain={ethereum} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approving">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approve Failed">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap (Switch Required)">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap Failed">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap: Partial Success">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "partialSuccess",
            data: {
              token: usdtPolygon,
              amount: "5.5",
            },
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swapping">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Done">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "done",
            status: "idle",
            data: {
              txHash: "0x1234567890",
            },
          }}
        />
      </ScreenContainer>
    </div>
  );
}

function SwapApproveTx(props: {
  theme: "dark" | "light";
}) {
  const generalProps: SwapFlowUIProps = {
    client: storyClient,
    onBack: noop,
    approvalRequired: {
      onApproveClick: noop,
    },
    txInfo: {
      cost: {
        amount: "2.7",
        chain: polygon,
        token: { nativeToken: true },
      },
      label: "Legendary Cat",
      onSendTxClick: noop,
    },
    to: {
      amount: "2.7885",
      chain: polygon,
      token: { nativeToken: true },
    },
    from: {
      amount: "5.0276",
      chain: polygon,
      token: usdcPolygon,
    },
    state: {
      activeStep: "approve",
      status: "idle",
    },
    onSwapClick: noop,
    activeChain: polygon,
    estimatedTimeToSwap: "~20s",
  };

  return (
    <div>
      <StoryScreenTitle label="2 step Swap + Tx" large />

      <ScreenContainer theme={props.theme} label="Approve">
        <SwapFlowUI {...generalProps} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approve (Switch Required)">
        <SwapFlowUI {...generalProps} activeChain={ethereum} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approving">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approve Failed">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap (Switch Required)">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swapping">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap Failed">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap: Partial Success">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "partialSuccess",
            data: {
              token: usdtPolygon,
              amount: "5.5",
            },
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Purchase">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Purchase (Switch Required)">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "pending",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Purchasing">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Purchase failed">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Done">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "done",
            status: "idle",
            data: {
              txHash: "0x1234567890",
            },
          }}
        />
      </ScreenContainer>
    </div>
  );
}

function SwapAndTx(props: {
  theme: "dark" | "light";
}) {
  const generalProps: SwapFlowUIProps = {
    client: storyClient,
    onBack: noop,
    approvalRequired: null,
    txInfo: {
      cost: {
        amount: "2.7",
        chain: polygon,
        token: { nativeToken: true },
      },
      label: "Legendary Cat",
      onSendTxClick: noop,
    },
    from: {
      amount: "8.8432",
      chain: polygon,
      token: { nativeToken: true },
    },
    to: {
      amount: "5.0276",
      chain: polygon,
      token: usdcPolygon,
    },
    state: {
      activeStep: "approve",
      status: "idle",
    },
    onSwapClick: noop,
    activeChain: polygon,
    estimatedTimeToSwap: "~20s",
  };

  return (
    <div>
      <StoryScreenTitle label="1 step Swap + Tx" large />

      <ScreenContainer theme={props.theme} label="Swap">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap (Switch Required)">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swapping">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap Failed">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap: Partial Success">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "partialSuccess",
            data: {
              token: usdtPolygon,
              amount: "5.5",
            },
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Purchase">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Purchase (Switch Required)">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "pending",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Purchasing">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Purchase failed">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Done">
        <SwapFlowUI
          {...generalProps}
          state={{
            activeStep: "done",
            status: "idle",
            data: {
              txHash: "0x1234567890",
            },
          }}
        />
      </ScreenContainer>
    </div>
  );
}
