import type { Meta, StoryObj } from "@storybook/react";
import {
  NotificationButtonInner,
  type NotificationMetadata,
} from "./NotificationButton";

const meta = {
  title: "headers/components/NotificationButton",
  component: NotificationButtonInner,
  decorators: [
    (Story) => (
      <div className="flex justify-end px-6 py-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotificationButtonInner>;

export default meta;
type Story = StoryObj<typeof meta>;

const titlesToPickFrom = [
  "Insight API Supports Block Queries",
  "Insight Adds Search Capability",
  "RPC Edge: Faster, Leaner, and Smarter",
  ".NET/Unity - Insight Indexer and Engine Wallet Integration",
  "Invite and Manage Team Members on Dashboard",
  "Insight API ENS Support",
  "Insight Token Queries Just Got 10X Faster",
  "Insight indexer major version upgrade",
  "Introducing Universal Bridge",
  "Unreal Engine Plugin v2",
  "Cross-chain deterministic contract deployments",
  "Organize Contracts into Projects on Dashboard",
  ".NET/Unity - Auth token login, timeout improvements, rotating secret keys.",
  "Mint fees for contract deployments update",
  "Engine v2.1.32: Circle Wallet and Secure Credential Management",
  "Nebula Update v0.0.7: Support for swapping and bridging, Offchain",
  "Insight - Automatic Event & Transaction Resolution",
  "Nebula Update v0.0.6: Upgraded Model, Speed & Accuracy Improvements",
  "Enhancing RPC Edge Support with Support IDs",
  "Blocks data retrieval with Insight [v0.2.2-beta]",
  "Insight reorg handling improvement",
  "Resilient Infrastructure & Smarter Insights",
  "Nebula Update v0.0.5: Advanced configurations, new endpoints, and simplified context filters",
  "Universal Smart Wallet Addresses",
  ".NET/Unity - Nebula Integration for native apps and games!",
];

function generateRandomNotification(isRead: boolean): NotificationMetadata {
  const index = Math.floor(Math.random() * titlesToPickFrom.length);
  const safeIndex = Math.min(index, titlesToPickFrom.length - 1);
  const title = titlesToPickFrom[safeIndex] || "";
  const randomTimeAgo = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Random time within last 7 days

  return {
    title,
    href: "https://blog.thirdweb.com/changelog",
    isRead,
    createdAt: new Date(Date.now() - randomTimeAgo).toISOString(),
    id: crypto.randomUUID(),
  };
}
function randomNotifications(count: number): NotificationMetadata[] {
  return Array.from({ length: count }, () => generateRandomNotification(false));
}

export const AllUnread: Story = {
  args: {
    notificationTabs: {
      inbox: {
        notifications: randomNotifications(10),
        isPending: false,
      },
      changelogs: {
        notifications: randomNotifications(30),
        isPending: false,
      },
    },
    markNotificationAsRead: () => Promise.resolve(),
  },
};

export const Loading: Story = {
  args: {
    notificationTabs: {
      inbox: {
        notifications: [],
        isPending: true,
      },
      changelogs: {
        notifications: [],
        isPending: true,
      },
    },
    markNotificationAsRead: () => Promise.resolve(),
  },
};

export const NoNotifications: Story = {
  args: {
    notificationTabs: {
      inbox: {
        notifications: [],
        isPending: false,
      },
      changelogs: {
        notifications: [],
        isPending: false,
      },
    },
    markNotificationAsRead: () => Promise.resolve(),
  },
};

export const AllRead: Story = {
  args: {
    notificationTabs: {
      inbox: {
        notifications: randomNotifications(30).map((x) => ({
          ...x,
          isRead: true,
        })),
        isPending: false,
      },
      changelogs: {
        notifications: randomNotifications(30).map((x) => ({
          ...x,
          isRead: true,
        })),
        isPending: false,
      },
    },
    markNotificationAsRead: () => Promise.resolve(),
  },
};

export const MixedNotifications: Story = {
  args: {
    notificationTabs: {
      inbox: {
        notifications: randomNotifications(10).map((x) => ({
          ...x,
          isRead: Math.random() > 0.5,
        })),
        isPending: false,
      },
      changelogs: {
        notifications: randomNotifications(30).map((x) => ({
          ...x,
          isRead: Math.random() > 0.5,
        })),
        isPending: false,
      },
    },
    markNotificationAsRead: () => Promise.resolve(),
  },
};

export const NoUnreadInboxNotifications: Story = {
  args: {
    notificationTabs: {
      inbox: {
        notifications: randomNotifications(5).map((x) => ({
          ...x,
          isRead: true,
        })),
        isPending: false,
      },
      changelogs: {
        notifications: randomNotifications(30).map((x) => ({
          ...x,
          isRead: Math.random() > 0.5,
        })),
        isPending: false,
      },
    },
    markNotificationAsRead: () => Promise.resolve(),
  },
};
