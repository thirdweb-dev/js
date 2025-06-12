import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "stories/utils";
import { StatBreakdownCard } from "./StatBreakdownCard";

const meta = {
  title: "Analytics/StatBreakdownCard",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof Component>;

export const Variants: Story = {
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
};

const baseChartData = [
  { value: 3753420.21, fill: "hsl(var(--chart-1))", label: "Base" },
  { value: 2134521, fill: "hsl(var(--chart-2))", label: "Xai" },
  { value: 423455.32, fill: "hsl(var(--chart-3))", label: "Ethereum" },
  { value: 134234.1, fill: "hsl(var(--chart-4))", label: "Polygon" },
];

const manyRowsData = [
  { value: 5000000, fill: "hsl(var(--chart-1))", label: "Bitcoin" },
  { value: 4500000, fill: "hsl(var(--chart-2))", label: "Ethereum" },
  { value: 4000000, fill: "hsl(var(--chart-3))", label: "Polygon" },
  { value: 3500000, fill: "hsl(var(--chart-4))", label: "Arbitrum" },
  { value: 3000000, fill: "hsl(var(--chart-5))", label: "Optimism" },
  { value: 2500000, fill: "hsl(var(--chart-6))", label: "Avalanche" },
  { value: 2000000, fill: "hsl(var(--chart-7))", label: "Binance" },
  { value: 1500000, fill: "hsl(var(--chart-8))", label: "Solana" },
  { value: 1000000, fill: "hsl(var(--chart-9))", label: "Cardano" },
  { value: 750000, fill: "hsl(var(--chart-10))", label: "Polkadot" },
  { value: 500000, fill: "hsl(var(--chart-1))", label: "Cosmos" },
  { value: 250000, fill: "hsl(var(--chart-2))", label: "Near" },
];

const withIconsData = [
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
    label: "Safari",
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
        <line x1="2" x2="22" y1="12" y2="12" />
        <line x1="12" x2="12" y1="2" y2="22" transform="rotate(45 12 12)" />
        <line x1="12" x2="12" y1="2" y2="22" transform="rotate(-45 12 12)" />
      </svg>
    ),
  },
  {
    value: 423455.32,
    fill: "hsl(var(--chart-3))",
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
];

function Component() {
  return (
    <div className="container max-w-[600px] space-y-10 py-10">
      <BadgeContainer label="Basic">
        <StatBreakdownCard
          title="Sponsored Gas"
          data={baseChartData}
          isCurrency
        />
      </BadgeContainer>

      <BadgeContainer label="Many Rows (Shows Top 9 + Other)">
        <StatBreakdownCard
          title="Network Distribution"
          data={manyRowsData}
          isCurrency
        />
      </BadgeContainer>

      <BadgeContainer label="With Icons">
        <StatBreakdownCard title="Browser Distribution" data={withIconsData} />
      </BadgeContainer>
    </div>
  );
}
