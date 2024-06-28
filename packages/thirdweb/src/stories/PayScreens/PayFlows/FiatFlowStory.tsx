import { ethereum } from "../../../chains/chain-definitions/ethereum.js";
import { polygon } from "../../../chains/chain-definitions/polygon.js";
import {
  FiatConfirmationScreenUI,
  type FiatConfirmationScreenUIProps,
} from "../../../react/web/ui/ConnectWallet/screens/Buy/confirmation/FiatConfirmationScreen.js";
import { USDCurrency } from "../../../react/web/ui/ConnectWallet/screens/Buy/fiat/currencies.js";
import {
  Row,
  StoryScreenTitle,
  noop,
  storyClient,
  usdcPolygon,
} from "../../utils.js";
import { ScreenContainer } from "../ScreenContainer.js";

export function FiatFlowStory(props: {
  theme: "dark" | "light";
}) {
  return (
    <div>
      <Row>
        <OnrampOnly theme={props.theme} />
        <OnrampAndOneStepSwap theme={props.theme} />
        <OnrampAndTwoStepSwap theme={props.theme} />
        <OnrampAndTwoStepSwapTx theme={props.theme} />
        <OnrampOneStepSwapTx theme={props.theme} />
      </Row>
    </div>
  );
}

function OnrampOnly(props: {
  theme: "dark" | "light";
}) {
  const generalProps: FiatConfirmationScreenUIProps = {
    onBack: noop,
    swapRequired: null,
    txInfo: null,
    fiatFrom: {
      amount: "34.32",
      currency: USDCurrency,
    },
    state: {
      activeStep: "onramp",
      status: "idle",
    },
    activeChain: polygon,
    client: storyClient,
    estimatedTimeToOnramp: "~2 minutes",
    onOnrampClick: noop,
    to: {
      amount: "30",
      chain: polygon,
      token: usdcPolygon,
    },
  };

  return (
    <div>
      <StoryScreenTitle label="Only Onramp" large />

      <ScreenContainer theme={props.theme} label="Onramp">
        <FiatConfirmationScreenUI {...generalProps} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Onramping">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "onramp",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Onramp failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "onramp",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Done">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "done",
            status: "idle",
            data: {
              chain: polygon,
              txHash: "0x1234567890",
            },
          }}
        />
      </ScreenContainer>
    </div>
  );
}

function OnrampAndOneStepSwap(props: {
  theme: "dark" | "light";
}) {
  const generalProps: FiatConfirmationScreenUIProps = {
    onBack: noop,
    swapRequired: {
      approvalRequired: null,
      estimatedTimeToSwap: "~20 seconds",
      onSwapClick: noop,
      swapFrom: {
        amount: "35",
        chain: polygon,
        token: { nativeToken: true },
      },
    },
    txInfo: null,
    fiatFrom: {
      amount: "34.32",
      currency: USDCurrency,
    },
    state: {
      activeStep: "onramp",
      status: "idle",
    },
    activeChain: polygon,
    client: storyClient,
    estimatedTimeToOnramp: "~2 minutes",
    onOnrampClick: noop,
    to: {
      amount: "30",
      chain: polygon,
      token: usdcPolygon,
    },
  };

  return (
    <div>
      <StoryScreenTitle label="OnRamp + 1step swap" large />

      <ScreenContainer theme={props.theme} label="Onramp">
        <FiatConfirmationScreenUI {...generalProps} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Onramping">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "onramp",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Onramp failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "onramp",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap (Switch Required)">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swapping">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Done">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "done",
            status: "idle",
            data: {
              chain: polygon,
              txHash: "0x1234567890",
            },
          }}
        />
      </ScreenContainer>
    </div>
  );
}

function OnrampAndTwoStepSwap(props: {
  theme: "dark" | "light";
}) {
  const generalProps: FiatConfirmationScreenUIProps = {
    onBack: noop,
    swapRequired: {
      approvalRequired: {
        onApproveClick: noop,
      },
      estimatedTimeToSwap: "~20 seconds",
      onSwapClick: noop,
      swapFrom: {
        amount: "35",
        chain: polygon,
        token: { nativeToken: true },
      },
    },
    txInfo: null,
    fiatFrom: {
      amount: "34.32",
      currency: USDCurrency,
    },
    state: {
      activeStep: "onramp",
      status: "idle",
    },
    activeChain: polygon,
    client: storyClient,
    estimatedTimeToOnramp: "~2 minutes",
    onOnrampClick: noop,
    to: {
      amount: "35",
      chain: polygon,
      token: usdcPolygon,
    },
  };

  return (
    <div>
      <StoryScreenTitle label="OnRamp + 2 step swap" large />

      <ScreenContainer theme={props.theme} label="Onramp">
        <FiatConfirmationScreenUI {...generalProps} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Onramping">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "onramp",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Onramp failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "onramp",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approve">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approve (Switch Required)">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approving">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approve Failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap (Switch Required)">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swapping">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Done">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "done",
            status: "idle",
            data: {
              chain: polygon,
              txHash: "0x1234567890",
            },
          }}
        />
      </ScreenContainer>
    </div>
  );
}

function OnrampAndTwoStepSwapTx(props: {
  theme: "dark" | "light";
}) {
  const generalProps: FiatConfirmationScreenUIProps = {
    onBack: noop,
    txInfo: {
      cost: {
        amount: "35",
        chain: polygon,
        token: usdcPolygon,
      },
      label: "Legendary Cat",
      onSendTxClick: noop,
    },
    swapRequired: {
      approvalRequired: {
        onApproveClick: noop,
      },
      estimatedTimeToSwap: "~20 seconds",
      onSwapClick: noop,
      swapFrom: {
        amount: "35",
        chain: polygon,
        token: { nativeToken: true },
      },
    },
    fiatFrom: {
      amount: "34.32",
      currency: USDCurrency,
    },
    state: {
      activeStep: "onramp",
      status: "idle",
    },
    activeChain: polygon,
    client: storyClient,
    estimatedTimeToOnramp: "~2 minutes",
    onOnrampClick: noop,
    to: {
      amount: "35",
      chain: polygon,
      token: usdcPolygon,
    },
  };

  return (
    <div>
      <StoryScreenTitle label="OnRamp + 2step swap + Tx" large />

      <ScreenContainer theme={props.theme} label="Onramp">
        <FiatConfirmationScreenUI {...generalProps} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Onramping">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "onramp",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Onramp failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "onramp",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approve">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approve (Switch Required)">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approving">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Approve Failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "approve",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap (Switch Required)">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swapping">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Purchase">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Send Tx (Switch Required)">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Sending Tx">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Send Tx failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Done">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "done",
            status: "idle",
            data: {
              chain: polygon,
              txHash: "0x1234567890",
            },
          }}
        />
      </ScreenContainer>
    </div>
  );
}

function OnrampOneStepSwapTx(props: {
  theme: "dark" | "light";
}) {
  const generalProps: FiatConfirmationScreenUIProps = {
    txInfo: {
      cost: {
        amount: "35",
        chain: polygon,
        token: usdcPolygon,
      },
      label: "Legendary Cat",
      onSendTxClick: noop,
    },
    onBack: noop,
    swapRequired: {
      approvalRequired: null,
      estimatedTimeToSwap: "~20 seconds",
      onSwapClick: noop,
      swapFrom: {
        amount: "35",
        chain: polygon,
        token: { nativeToken: true },
      },
    },
    fiatFrom: {
      amount: "34.32",
      currency: USDCurrency,
    },
    state: {
      activeStep: "onramp",
      status: "idle",
    },
    activeChain: polygon,
    client: storyClient,
    estimatedTimeToOnramp: "~2 minutes",
    onOnrampClick: noop,
    to: {
      amount: "30",
      chain: polygon,
      token: usdcPolygon,
    },
  };

  return (
    <div>
      <StoryScreenTitle label="OnRamp + 1 step swap + Tx" large />

      <ScreenContainer theme={props.theme} label="Onramp">
        <FiatConfirmationScreenUI {...generalProps} />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Onramping">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "onramp",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Onramp failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "onramp",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap (Switch Required)">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swapping">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Swap failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "swap",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Purchase">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "idle",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Send Tx (Switch Required)">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "idle",
          }}
          activeChain={ethereum}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Sending Tx">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "pending",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Send Tx failed">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "sendTx",
            status: "error",
          }}
        />
      </ScreenContainer>

      <ScreenContainer theme={props.theme} label="Done">
        <FiatConfirmationScreenUI
          {...generalProps}
          state={{
            activeStep: "done",
            status: "idle",
            data: {
              chain: polygon,
              txHash: "0x1234567890",
            },
          }}
        />
      </ScreenContainer>
    </div>
  );
}
