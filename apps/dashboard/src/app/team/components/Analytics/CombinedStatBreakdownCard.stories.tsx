import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { CombinedStatBreakdownCard } from "./CombinedStatBreakdownCard";

const meta = {
  title: "Analytics/CombinedStatBreakdownCard",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export const Mobile: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    viewport: mobileViewport("iphone14"),
  },
};

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

function Component() {
  return (
    <div className="max-w-[1000px] space-y-8 py-8 md:container">
      <BadgeContainer label="Chains View">
        <CombinedStatBreakdownCard
          title="Network Activity"
          config={breakdownConfig}
          activeKey="chains"
          queryKey="chart"
          isCurrency
        />
      </BadgeContainer>

      <BadgeContainer label="Browsers View">
        <CombinedStatBreakdownCard
          title="Network Activity"
          config={breakdownConfig}
          activeKey="browsers"
          queryKey="chart"
        />
      </BadgeContainer>
    </div>
  );
}
