import type { Meta, StoryObj } from "@storybook/nextjs";
import type { InAppWalletAuth } from "thirdweb/wallets";
import { BadgeContainer } from "@/storybook/utils";
import { AutoMergeBarChart, type StatData } from "./automerge-barchart";

const meta = {
  component: Component,
  title: "Charts/AutoMergeBarChart",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Component() {
  const title = "This is Title";
  const description =
    "This is an example of a description about user wallet usage chart";
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <BadgeContainer label="10 days, view more variant">
        <AutoMergeBarChart
          viewMoreLink={"#"}
          description={description}
          stats={createStatsStub(10)}
          isPending={false}
          title={title}
          maxLabelsToShow={5}
          emptyChartState={undefined}
          exportButton={undefined}
        />
      </BadgeContainer>

      <BadgeContainer label="30 days">
        <AutoMergeBarChart
          viewMoreLink={undefined}
          description={description}
          stats={createStatsStub(30)}
          isPending={false}
          title={title}
          maxLabelsToShow={5}
          emptyChartState={undefined}
          exportButton={{
            fileName: "in-app-wallets",
          }}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <AutoMergeBarChart
          viewMoreLink={undefined}
          description={description}
          stats={createStatsStub(60)}
          isPending={false}
          title={title}
          maxLabelsToShow={5}
          emptyChartState={undefined}
          exportButton={{
            fileName: "in-app-wallets",
          }}
        />
      </BadgeContainer>

      <BadgeContainer label="120 days">
        <AutoMergeBarChart
          viewMoreLink={undefined}
          description={description}
          stats={createStatsStub(120)}
          isPending={false}
          title={title}
          maxLabelsToShow={5}
          emptyChartState={undefined}
          exportButton={{
            fileName: "in-app-wallets",
          }}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <AutoMergeBarChart
          viewMoreLink={undefined}
          description={description}
          stats={createStatsStub(10)}
          isPending={false}
          title={title}
          maxLabelsToShow={5}
          emptyChartState={undefined}
          exportButton={{
            fileName: "in-app-wallets",
          }}
        />
      </BadgeContainer>

      <BadgeContainer label="Empty List">
        <AutoMergeBarChart
          viewMoreLink={undefined}
          description={description}
          stats={createStatsStub(0)}
          isPending={false}
          title={title}
          maxLabelsToShow={5}
          emptyChartState={undefined}
          exportButton={{
            fileName: "in-app-wallets",
          }}
        />
      </BadgeContainer>

      <BadgeContainer label="Pending">
        <AutoMergeBarChart
          viewMoreLink={undefined}
          description={description}
          stats={[]}
          isPending={true}
          title={title}
          maxLabelsToShow={5}
          emptyChartState={undefined}
          exportButton={{
            fileName: "in-app-wallets",
          }}
        />
      </BadgeContainer>
    </div>
  );
}

const authMethodsToPickFrom: InAppWalletAuth[] = [
  "google",
  "apple",
  "facebook",
  "discord",
  "line",
  "x",
  "tiktok",
  "epic",
  "coinbase",
  "farcaster",
  "telegram",
  "github",
  "twitch",
  "steam",
  "guest",
  "email",
  "phone",
  "passkey",
  "wallet",
];

const pickRandomAuthMethod = () => {
  const picked =
    authMethodsToPickFrom[
      Math.floor(Math.random() * authMethodsToPickFrom.length)
    ] || "google";

  const capitalized = picked.charAt(0).toUpperCase() + picked.slice(1);
  return capitalized;
};

function createStatsStub(days: number): StatData[] {
  const stubbedData: StatData[] = [];

  let d = days;
  while (d !== 0) {
    const uniqueWallets = Math.floor(Math.random() * 100);
    stubbedData.push({
      label: pickRandomAuthMethod(),
      date: new Date(2024, 11, d).toLocaleString(),
      count: uniqueWallets,
    });

    if (Math.random() > 0.7) {
      d--;
    }
  }

  return stubbedData;
}
