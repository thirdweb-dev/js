import type { Meta, StoryObj } from "@storybook/react";
import { polygon } from "../../chains/chain-definitions/polygon.js";
import { BuyUIMainScreen } from "../../react/web/ui/ConnectWallet/screens/Buy/main/BuyUIMainScreen.js";
import { storyClient } from "../utils.js";
import { PayScreenTester } from "./PayScreenTester.js";

function Test(props: {
  theme: "dark" | "light";
}) {
  return (
    <PayScreenTester
      theme={props.theme}
      render={(props) => {
        const noop = () => {};
        return (
          <BuyUIMainScreen
            account={null}
            buyForTx={null}
            client={storyClient}
            onSelectBuyToken={noop}
            onViewPendingTx={noop}
            payOptions={{}}
            setScreen={noop}
            setTokenAmount={noop}
            supportedDestinations={props.supportedDestinations}
            // Buy 20 polygon
            toChain={polygon}
            toToken={{ nativeToken: true }}
            tokenAmount="20"
          />
        );
      }}
    />
  );
}

const meta = {
  title: "Pay Screens/Initial Screen",
  component: Test,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Test>;

type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const Light: Story = {
  args: {
    theme: "light",
  },
};

export default meta;
