import type { Meta, StoryObj } from "@storybook/react";
import { useBuySupportedDestinations } from "../../react/web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import { Row, storyAccount, storyClient } from "../utils.js";
import { BuyWithCryptoFlowTest } from "./BuyWithCryptoFlowTest.js";
import { BuyWithFiatFlowTest } from "./BuyWithFiatFlowTest.js";
import {
  getBuyBaseUSDCWithUSDFiatMocks,
  getBuyPolygonWithUSDCMocks,
  getBuyPolygonWithUSDFiatMocks,
} from "./mockQuotes.js";

function Test(props: {
  theme: "dark" | "light";
}) {
  const supportedDestinationsQuery = useBuySupportedDestinations(storyClient);

  if (!supportedDestinationsQuery.data) {
    return <div> Loading story </div>;
  }

  return (
    <div>
      <Row>
        <BuyWithCryptoFlowTest
          mocks={getBuyPolygonWithUSDCMocks({
            fromAddress: storyAccount.address,
            toAddress: storyAccount.address,
          })}
          theme={props.theme}
          supportedDestinations={supportedDestinationsQuery.data}
        />

        <BuyWithFiatFlowTest
          mocks={getBuyPolygonWithUSDFiatMocks({
            fromAddress: storyAccount.address,
            toAddress: storyAccount.address,
          })}
          theme={props.theme}
          supportedDestinations={supportedDestinationsQuery.data}
        />

        <BuyWithFiatFlowTest
          mocks={getBuyBaseUSDCWithUSDFiatMocks({
            fromAddress: storyAccount.address,
            toAddress: storyAccount.address,
          })}
          theme={props.theme}
          supportedDestinations={supportedDestinationsQuery.data}
        />
      </Row>
    </div>
  );
}

const meta = {
  title: "Pay/Flows",
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
