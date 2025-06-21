import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "stories/utils";
import { StatBreakdown } from "./StatBreakdown";

const meta = {
  component: Component,
  title: "Analytics/StatBreakdown",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
};

const baseData = [
  { fill: "hsl(var(--chart-1))", label: "Base", value: 3753420.21 },
  { fill: "hsl(var(--chart-2))", label: "Xai", value: 2134521 },
  { fill: "hsl(var(--chart-3))", label: "Ethereum", value: 423455.32 },
  { fill: "hsl(var(--chart-4))", label: "Polygon", value: 134234.1 },
];

const withIconsData = [
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
];

function Component() {
  return (
    <div className="container max-w-[600px] space-y-10 py-10">
      <BadgeContainer label="Basic">
        <StatBreakdown data={baseData} />
      </BadgeContainer>

      <BadgeContainer label="With Currency Formatter">
        <StatBreakdown data={baseData} isCurrency />
      </BadgeContainer>

      <BadgeContainer label="With Icons">
        <StatBreakdown data={withIconsData} />
      </BadgeContainer>
    </div>
  );
}
