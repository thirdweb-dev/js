import type { Meta, StoryObj } from "@storybook/react";
import { useBuySupportedDestinations } from "../../../react/web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import { storyAccount, storyClient } from "../../utils.js";
import { BuyWithFiatFlowTest } from "../BuyWithFiatFlowTest.js";
import { getBuyPolygonWithUSDFiatMocks } from "../mockQuotes.js";

function Test(props: {
  theme: "dark" | "light";
}) {
  const supportedDestinationsQuery = useBuySupportedDestinations(storyClient);

  if (!supportedDestinationsQuery.data) {
    return <div> Loading story </div>;
  }

  return (
    <BuyWithFiatFlowTest
      mocks={getBuyPolygonWithUSDFiatMocks({
        fromAddress: storyAccount.address,
        toAddress: storyAccount.address,
      })}
      theme={props.theme}
      supportedDestinations={supportedDestinationsQuery.data}
    />
  );
}

const meta = {
  title: "Pay/Flows/Onramp only",
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
