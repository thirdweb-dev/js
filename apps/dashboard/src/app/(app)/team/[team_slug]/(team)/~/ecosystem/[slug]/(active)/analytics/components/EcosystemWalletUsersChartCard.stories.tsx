import type { Meta, StoryObj } from "@storybook/react";
import type { EcosystemWalletStats } from "types/analytics";
import { EcosystemWalletUsersChartCard } from "./EcosystemWalletUsersChartCard";

const meta = {
  title: "Ecosystem/Analytics/EcosystemWalletUsersChartCard",
  component: EcosystemWalletUsersChartCard,
  decorators: [
    (Story) => (
      <div className="container max-w-7xl py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EcosystemWalletUsersChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const authMethods = [
  "Email",
  "Google",
  "Apple",
  "Discord",
  "Twitter",
  "GitHub",
  "Facebook",
  "Twitch",
  "LinkedIn",
  "TikTok",
  "Coinbase",
  "MetaMask",
];

function ecosystemWalletStatsStub(
  length: number,
  startDate = new Date(2024, 11, 1),
): EcosystemWalletStats[] {
  const stats: EcosystemWalletStats[] = [];

  for (let i = 0; i < length; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const formattedDate = date.toISOString().split("T")[0] || "";

    // each day, we pick between 1 and 4 auth methods
    const authMethodsToPick = Math.floor(Math.random() * 4) + 1;

    for (let j = 0; j < authMethodsToPick; j++) {
      const authMethod =
        authMethods[Math.floor(Math.random() * authMethods.length)];
      stats.push({
        date: formattedDate,
        authenticationMethod: authMethod || "MetaMask",
        uniqueWalletsConnected: Math.floor(Math.random() * 1000) + 1,
        ecosystemPartnerId: "123",
      });
    }
  }

  return stats;
}

// Empty data state
export const EmptyData: Story = {
  args: {
    ecosystemWalletStats: [],
    isPending: false,
    groupBy: "authenticationMethod",
  },
};

// Loading state
export const Loading: Story = {
  args: {
    ecosystemWalletStats: [],
    isPending: true,
    groupBy: "authenticationMethod",
  },
};

// 30 days of data
export const ThirtyDaysData: Story = {
  args: {
    ecosystemWalletStats: ecosystemWalletStatsStub(30),
    isPending: false,
    groupBy: "authenticationMethod",
  },
};

// 60 days of data
export const SixtyDaysData: Story = {
  args: {
    ecosystemWalletStats: ecosystemWalletStatsStub(60),
    isPending: false,
    groupBy: "authenticationMethod",
  },
};

// 120 days of data
export const OneHundredTwentyDaysData: Story = {
  args: {
    ecosystemWalletStats: ecosystemWalletStatsStub(120),
    isPending: false,
    groupBy: "authenticationMethod",
  },
};

// Data with lots of authentication methods to test the "Others" category
export const ManyAuthMethods: Story = {
  args: {
    ecosystemWalletStats: (() => {
      // Generate data with 15 different auth methods to test "Others" category
      const basicData = ecosystemWalletStatsStub(30);

      return basicData.map((item, index) => ({
        ...item,
        authenticationMethod:
          authMethods[index % authMethods.length] || "MetaMask",
      }));
    })(),
    isPending: false,
    groupBy: "authenticationMethod",
  },
};

// Zero values test
export const ZeroValues: Story = {
  args: {
    ecosystemWalletStats: ecosystemWalletStatsStub(30).map((stat) => ({
      ...stat,
      uniqueWalletsConnected: 0,
    })),
    isPending: false,
    groupBy: "authenticationMethod",
  },
};
