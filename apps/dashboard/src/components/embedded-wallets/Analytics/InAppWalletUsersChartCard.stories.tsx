import type { Meta, StoryObj } from "@storybook/react";
import type { InAppWalletAuth } from "thirdweb/wallets";
import type { InAppWalletStats } from "types/analytics";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import { InAppWalletUsersChartCardUI } from "./InAppWalletUsersChartCard";

const meta = {
  title: "Charts/InAppWallets",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Component() {
  const title = "This is Title";
  const description =
    "This is an example of a description about in-app wallet usage chart";
  return (
    <div className="container flex max-w-[1150px] flex-col gap-10 py-10">
      <BadgeContainer label="30 days">
        <InAppWalletUsersChartCardUI
          inAppWalletStats={createInAppWalletStatsStub(30)}
          isPending={false}
          title={title}
          description={description}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <InAppWalletUsersChartCardUI
          inAppWalletStats={createInAppWalletStatsStub(60)}
          isPending={false}
          title={title}
          description={description}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <InAppWalletUsersChartCardUI
          inAppWalletStats={createInAppWalletStatsStub(10)}
          isPending={false}
          title={title}
          description={description}
        />
      </BadgeContainer>

      <BadgeContainer label="Empty List">
        <InAppWalletUsersChartCardUI
          inAppWalletStats={createInAppWalletStatsStub(0)}
          isPending={false}
          title={title}
          description={description}
        />
      </BadgeContainer>

      <BadgeContainer label="Pending">
        <InAppWalletUsersChartCardUI
          inAppWalletStats={[]}
          isPending={true}
          title={title}
          description={description}
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

function createInAppWalletStatsStub(days: number): InAppWalletStats[] {
  const stubbedData: InAppWalletStats[] = [];

  let d = days;
  while (d !== 0) {
    const uniqueWallets = Math.floor(Math.random() * 100);
    stubbedData.push({
      date: new Date(2024, 1, d).toLocaleString(),
      uniqueWalletsConnected: uniqueWallets,
      authenticationMethod: pickRandomAuthMethod(),
    });

    if (Math.random() > 0.7) {
      d--;
    }
  }

  return stubbedData;
}
