import type { Meta, StoryObj } from "@storybook/nextjs";
import type { EcosystemWalletStats } from "@/types/analytics";
import { EcosystemWalletUsersChartCard } from "./EcosystemWalletUsersChartCard";

const meta = {
  component: EcosystemWalletUsersChartCard,
  decorators: [
    (Story) => (
      <div className="container max-w-7xl py-10">
        <Story />
      </div>
    ),
  ],
  title: "Ecosystem/Analytics/EcosystemWalletUsersChartCard",
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
        authenticationMethod: authMethod || "MetaMask",
        date: formattedDate,
        ecosystemPartnerId: "123",
        uniqueWalletsConnected: Math.floor(Math.random() * 1000) + 1,
      });
    }
  }

  return stats;
}

// Empty data state
export const EmptyData: Story = {
  args: {
    ecosystemWalletStats: [],
    groupBy: "authenticationMethod",
    isPending: false,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    ecosystemWalletStats: [],
    groupBy: "authenticationMethod",
    isPending: true,
  },
};

// 30 days of data
export const ThirtyDaysData: Story = {
  args: {
    ecosystemWalletStats: ecosystemWalletStatsStub(30),
    groupBy: "authenticationMethod",
    isPending: false,
  },
};

// 60 days of data
export const SixtyDaysData: Story = {
  args: {
    ecosystemWalletStats: ecosystemWalletStatsStub(60),
    groupBy: "authenticationMethod",
    isPending: false,
  },
};

// 120 days of data
export const OneHundredTwentyDaysData: Story = {
  args: {
    ecosystemWalletStats: ecosystemWalletStatsStub(120),
    groupBy: "authenticationMethod",
    isPending: false,
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
    groupBy: "authenticationMethod",
    isPending: false,
  },
};

// Zero values test
export const ZeroValues: Story = {
  args: {
    ecosystemWalletStats: ecosystemWalletStatsStub(30).map((stat) => ({
      ...stat,
      uniqueWalletsConnected: 0,
    })),
    groupBy: "authenticationMethod",
    isPending: false,
  },
};
