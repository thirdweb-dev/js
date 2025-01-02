import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "stories/utils";
import type { RpcMethodStats } from "types/analytics";
import { RpcMethodBarChartCardUI } from "./RpcMethodBarChartCardUI";

const meta = {
  title: "Analytics/RpcMethodBarChartCard",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

const generateTimeSeriesData = (
  days: number,
  methods: string[],
  emptyData = false,
) => {
  const data: RpcMethodStats[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    for (const method of methods) {
      data.push({
        date: date.toISOString(),
        evmMethod: method,
        count: emptyData ? 0 : Math.floor(Math.random() * 1000) + 100,
      });
    }
  }

  return data;
};

const commonMethods = [
  "eth_call",
  "eth_getBalance",
  "eth_getTransactionReceipt",
  "eth_blockNumber",
];

function Component() {
  return (
    <div className="container space-y-8 py-8">
      <BadgeContainer label="Normal Usage">
        <RpcMethodBarChartCardUI
          rawData={generateTimeSeriesData(30, commonMethods)}
        />
      </BadgeContainer>

      <BadgeContainer label="Empty Data">
        <RpcMethodBarChartCardUI rawData={[]} />
      </BadgeContainer>

      <BadgeContainer label="Zero Values">
        <RpcMethodBarChartCardUI
          rawData={generateTimeSeriesData(30, commonMethods, true)}
        />
      </BadgeContainer>

      <BadgeContainer label="Single Method">
        <RpcMethodBarChartCardUI
          rawData={generateTimeSeriesData(30, ["eth_call"])}
        />
      </BadgeContainer>
    </div>
  );
}
