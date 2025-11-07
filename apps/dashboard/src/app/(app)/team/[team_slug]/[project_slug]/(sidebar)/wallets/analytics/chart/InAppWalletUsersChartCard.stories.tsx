import type { Meta, StoryObj } from "@storybook/nextjs";
import type { InAppWalletAuth } from "thirdweb/wallets";
import { BadgeContainer } from "@/storybook/utils";
import type { InAppWalletStats } from "@/types/analytics";
import { InAppWalletUsersChartCardUI } from "./InAppWalletUsersChartCard";

const meta = {
  component: Component,
  title: "Charts/InAppWallets",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Component() {
  const title = "This is Title";
  const description =
    "This is an example of a description about in-app wallet usage chart";
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <BadgeContainer label="30 days">
        <InAppWalletUsersChartCardUI
          description={description}
          inAppWalletStats={createInAppWalletStatsStub(30)}
          isPending={false}
          title={title}
        />
      </BadgeContainer>

      <BadgeContainer label="60 days">
        <InAppWalletUsersChartCardUI
          description={description}
          inAppWalletStats={createInAppWalletStatsStub(60)}
          isPending={false}
          title={title}
        />
      </BadgeContainer>

      <BadgeContainer label="120 days">
        <InAppWalletUsersChartCardUI
          description={description}
          inAppWalletStats={createInAppWalletStatsStub(120)}
          isPending={false}
          title={title}
        />
      </BadgeContainer>

      <BadgeContainer label="10 days">
        <InAppWalletUsersChartCardUI
          description={description}
          inAppWalletStats={createInAppWalletStatsStub(10)}
          isPending={false}
          title={title}
        />
      </BadgeContainer>

      <BadgeContainer label="Empty List">
        <InAppWalletUsersChartCardUI
          description={description}
          inAppWalletStats={createInAppWalletStatsStub(0)}
          isPending={false}
          title={title}
        />
      </BadgeContainer>

      <BadgeContainer label="Pending">
        <InAppWalletUsersChartCardUI
          description={description}
          inAppWalletStats={[]}
          isPending={true}
          title={title}
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

function createInAppWalletStatsStub(days: number): InAppWalletStats[] {
  const stubbedData: InAppWalletStats[] = [];

  let d = days;
  while (d !== 0) {
    const uniqueWallets = Math.floor(Math.random() * 100);
    stubbedData.push({
      authenticationMethod: pickRandomAuthMethod(),
      date: new Date(2024, 11, d).toLocaleString(),
      uniqueWalletsConnected: uniqueWallets,
      newUsers: Math.floor(Math.random() * 100) + 1,
    });

    if (Math.random() > 0.7) {
      d--;
    }
  }

  return stubbedData;
}
