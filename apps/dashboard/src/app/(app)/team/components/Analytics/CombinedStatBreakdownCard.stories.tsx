import type { Meta, StoryObj } from "@storybook/nextjs";
import { CombinedStatBreakdownCard } from "./CombinedStatBreakdownCard";

const meta = {
  title: "Analytics/CombinedStatBreakdownCard",
  component: CombinedStatBreakdownCard,
  decorators: [
    (Story) => (
      <div className="container max-w-6xl py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CombinedStatBreakdownCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const breakdownConfig = {
  chains: {
    label: "Chain Distribution",
    data: [
      { value: 3753420.21, fill: "hsl(var(--chart-1))", label: "Base" },
      { value: 2134521, fill: "hsl(var(--chart-2))", label: "Xai" },
      { value: 423455.32, fill: "hsl(var(--chart-3))", label: "Ethereum" },
      { value: 134234.1, fill: "hsl(var(--chart-4))", label: "Polygon" },
    ],
  },
  browsers: {
    label: "Browser Distribution",
    data: [
      {
        value: 3753420.21,
        fill: "hsl(var(--chart-1))",
        label: "Chrome",
        icon: (
          // biome-ignore lint/a11y/noSvgWithoutTitle: This is a test icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" x2="12" y1="8" y2="8" />
            <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
            <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
          </svg>
        ),
      },
      {
        value: 2134521,
        fill: "hsl(var(--chart-2))",
        label: "Firefox",
        icon: (
          // biome-ignore lint/a11y/noSvgWithoutTitle: This is a test icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        ),
      },
    ],
  },
};

export const ChainsView: Story = {
  args: {
    title: "Network Activity",
    config: breakdownConfig,
    activeKey: "chains",
    queryKey: "chart",
  },
};

export const BrowsersView: Story = {
  args: {
    title: "Network Activity",
    config: breakdownConfig,
    activeKey: "browsers",
    queryKey: "chart",
  },
};

export const ChainsViewIsCurrency: Story = {
  args: {
    title: "Network Activity",
    config: breakdownConfig,
    activeKey: "chains",
    queryKey: "chart",
    isCurrency: true,
  },
};
