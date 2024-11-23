import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { RpcMethodBarChartCardUI } from "./RpcMethodBarChartCard";

const meta = {
  title: "Analytics/RpcMethodBarChartCard",
  component: RpcMethodBarChartCardUI,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof RpcMethodBarChartCardUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const generateTimeSeriesData = (days: number, methods: string[], emptyData = false) => {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    methods.forEach(method => {
      data.push({
        date: date.toISOString(),
        evmMethod: method,
        count: emptyData ? 0 : Math.floor(Math.random() * 1000) + 100
      });
    });
  }

  return data;
};

const commonMethods = [
  "eth_call",
  "eth_getBalance",
  "eth_getTransactionReceipt",
  "eth_blockNumber"
];

export const Normal: Story = {
  args: {
    rawData: generateTimeSeriesData(30, commonMethods)
  },
  decorators: [
    (Story) => (
      <div className="max-w-[1000px] p-8">
        <BadgeContainer label="Normal Usage">
          <Story />
        </BadgeContainer>
      </div>
    ),
  ],
};

export const EmptyData: Story = {
  args: {
    rawData: []
  },
  decorators: [
    (Story) => (
      <div className="max-w-[1000px] p-8">
        <BadgeContainer label="Empty Data">
          <Story />
        </BadgeContainer>
      </div>
    ),
  ],
};

export const ZeroData: Story = {
  args: {
    rawData: generateTimeSeriesData(30, commonMethods, true)
  },
  decorators: [
    (Story) => (
      <div className="max-w-[1000px] p-8">
        <BadgeContainer label="Zero Values">
          <Story />
        </BadgeContainer>
      </div>
    ),
  ],
};

export const SingleMethod: Story = {
  args: {
    rawData: generateTimeSeriesData(30, ["eth_call"])
  },
  decorators: [
    (Story) => (
      <div className="max-w-[1000px] p-8">
        <BadgeContainer label="Single Method">
          <Story />
        </BadgeContainer>
      </div>
    ),
  ],
};

export const Mobile: Story = {
  args: {
    rawData: generateTimeSeriesData(30, commonMethods)
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px] p-4">
        <BadgeContainer label="Mobile View">
          <Story />
        </BadgeContainer>
      </div>
    ),
  ],
};
