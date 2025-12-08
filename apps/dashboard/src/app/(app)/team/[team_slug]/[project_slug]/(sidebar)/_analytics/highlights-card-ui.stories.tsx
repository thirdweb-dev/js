import type { Meta } from "@storybook/nextjs";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import type {
  InAppWalletStats,
  UniversalBridgeStats,
  X402SettlementsOverall,
} from "@/types/analytics";
import { ProjectHighlightsCard } from "./highlights-card-ui";

const meta = {
  component: ProjectHighlightsCard,
  decorators: [
    (Story) => (
      <ResponsiveSearchParamsProvider value={{}}>
        <div className="container max-w-6xl py-10">
          <Story />
        </div>
      </ResponsiveSearchParamsProvider>
    ),
  ],
  title: "Analytics/ProjectHighlightsCard",
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof ProjectHighlightsCard>;

export default meta;

function generateDateSeries(days: number) {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString());
  }
  return dates;
}

function inAppWalletStub(days: number): InAppWalletStats[] {
  const dates = generateDateSeries(days);
  return dates.map((date) => {
    return {
      // main data
      newUsers: randomValue(50, 100),
      uniqueWalletsConnected: randomValue(500, 1200),
      // others
      authenticationMethod: "email",
      date,
    };
  });
}

// a few aggregated entries that will be summed for the "Active Users" stat
function aggregatedInAppWalletsStub(): InAppWalletStats[] {
  return Array.from({ length: 3 }).map(() => {
    return {
      // main data
      newUsers: randomValue(50, 100),
      uniqueWalletsConnected: randomValue(500, 1200),
      // others
      date: new Date().toISOString(),
      authenticationMethod: "email",
    };
  });
}

function bridgeVolumeStub(days: number): UniversalBridgeStats[] {
  const dates = generateDateSeries(days);
  return dates.map((date) => {
    return {
      // main data
      developerFeeUsdCents: randomValue(500 * 100, 2500 * 100),
      status: "completed",
      // others
      chainId: 0,
      count: 0,
      date,
      amountUsdCents: 0,
      type: "onchain",
    };
  });
}

function randomValue(min: number, max: number) {
  return Math.max(0, Math.round(min + Math.random() * (max - min)));
}

function generateX402Settlements(days: number): X402SettlementsOverall[] {
  const dates = generateDateSeries(days);
  return dates.map((date) => {
    return {
      date,
      totalRequests: randomValue(10, 100),
      totalValue: randomValue(500, 2500),
      totalValueUSD: randomValue(500, 2500),
    };
  });
}

export function ThirtyDays() {
  const days = 30;
  const data = {
    aggregatedUserStats: aggregatedInAppWalletsStub(),
    userStats: inAppWalletStub(days),
    bridgeVolumeStats: bridgeVolumeStub(days),
    x402Settlements: generateX402Settlements(days),
  };

  return (
    <ProjectHighlightsCard
      aggregatedUserStats={data.aggregatedUserStats}
      userStats={data.userStats}
      volumeStats={data.bridgeVolumeStats}
      x402Settlements={data.x402Settlements}
    />
  );
}

export function SingleDayRevenue() {
  const days = 1;
  const data = {
    aggregatedUserStats: [],
    userStats: [],
    bridgeVolumeStats: bridgeVolumeStub(days),
    x402Settlements: generateX402Settlements(days),
  };

  return (
    <ProjectHighlightsCard
      aggregatedUserStats={data.aggregatedUserStats}
      userStats={data.userStats}
      volumeStats={data.bridgeVolumeStats}
      x402Settlements={data.x402Settlements}
    />
  );
}

export function SingleDayRevenueNoX402() {
  const days = 1;
  const data = {
    aggregatedUserStats: [],
    userStats: [],
    bridgeVolumeStats: bridgeVolumeStub(days),
    x402Settlements: [],
  };

  return (
    <ProjectHighlightsCard
      aggregatedUserStats={data.aggregatedUserStats}
      userStats={data.userStats}
      volumeStats={data.bridgeVolumeStats}
      x402Settlements={data.x402Settlements}
    />
  );
}
