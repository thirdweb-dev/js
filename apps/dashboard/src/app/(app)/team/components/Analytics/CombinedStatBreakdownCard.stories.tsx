import type { Meta, StoryObj } from "@storybook/nextjs";
import { CombinedStatBreakdownCard } from "./CombinedStatBreakdownCard";

const meta = {
  component: CombinedStatBreakdownCard,
  decorators: [
    (Story) => (
      <div className="container max-w-6xl py-10">
        <Story />
      </div>
    ),
  ],
  title: "Analytics/CombinedStatBreakdownCard",
} satisfies Meta<typeof CombinedStatBreakdownCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const breakdownConfig = {
  browsers: {
    data: [
      {
        fill: "hsl(var(--chart-1))",
        icon: (
          // biome-ignore lint/a11y/noSvgWithoutTitle: This is a test icon
          <svg
            className="size-4"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" x2="12" y1="8" y2="8" />
            <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
            <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
          </svg>
        ),
        label: "Chrome",
        value: 3753420.21,
      },
      {
        fill: "hsl(var(--chart-2))",
        icon: (
          // biome-ignore lint/a11y/noSvgWithoutTitle: This is a test icon
          <svg
            className="size-4"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        ),
        label: "Firefox",
        value: 2134521,
      },
    ],
    label: "Browser Distribution",
  },
  chains: {
    data: [
      { fill: "hsl(var(--chart-1))", label: "Base", value: 3753420.21 },
      { fill: "hsl(var(--chart-2))", label: "Xai", value: 2134521 },
      { fill: "hsl(var(--chart-3))", label: "Ethereum", value: 423455.32 },
      { fill: "hsl(var(--chart-4))", label: "Polygon", value: 134234.1 },
    ],
    label: "Chain Distribution",
  },
};

export const ChainsView: Story = {
  args: {
    activeKey: "chains",
    config: breakdownConfig,
    queryKey: "chart",
    title: "Network Activity",
  },
};

export const BrowsersView: Story = {
  args: {
    activeKey: "browsers",
    config: breakdownConfig,
    queryKey: "chart",
    title: "Network Activity",
  },
};

export const ChainsViewIsCurrency: Story = {
  args: {
    activeKey: "chains",
    config: breakdownConfig,
    isCurrency: true,
    queryKey: "chart",
    title: "Network Activity",
  },
};
