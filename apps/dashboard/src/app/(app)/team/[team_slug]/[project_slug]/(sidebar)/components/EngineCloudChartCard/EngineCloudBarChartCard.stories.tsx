import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "stories/utils";
import type { EngineCloudStats } from "types/analytics";
import { EngineCloudBarChartCardUI } from "./EngineCloudBarChartCardUI";

const meta = {
  title: "Analytics/EngineCloudBarChartCard",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
};

const generateTimeSeriesData = (days: number, pathnames: string[]) => {
  const data: EngineCloudStats[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    for (const pathname of pathnames) {
      data.push({
        // biome-ignore lint/style/noNonNullAssertion: we know this is not null
        date: dateStr!,
        chainId: "84532",
        pathname,
        totalRequests: Math.floor(Math.random() * 1000) + 100,
      });
    }
  }

  return data;
};

function Component() {
  return (
    <div className="container max-w-6xl space-y-10 py-10">
      <BadgeContainer label="Multiple Pathnames">
        <EngineCloudBarChartCardUI
          rawData={generateTimeSeriesData(30, [
            "/v1/write/transaction",
            "/v1/sign/transaction",
            "/v1/sign/message",
          ])}
        />
      </BadgeContainer>
    </div>
  );
}
