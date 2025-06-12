import type { Meta, StoryObj } from "@storybook/nextjs";
import { LatestEventsUI } from "./LatestEvents";

const meta: Meta<typeof LatestEventsUI> = {
  title: "Contracts/Overview/LatestEvents",
  component: LatestEventsUI,
  decorators: [
    (Story) => (
      <div className="container max-w-4xl py-10">
        <Story />
      </div>
    ),
  ],
  args: {
    allEvents: [],
    autoUpdate: false,
    eventsHref: "/ethereum/0x123456789/events",
    trackingCategory: "test-category",
  },
};

function eventStub(eventName: string) {
  return {
    logIndex: 0,
    eventName,
    address: "0x",
    args: [],
  };
}

const txStub =
  "0x9ef44ea701637e0f7c42666b6f99f4aad9aa6b9b51995cd22df1507288e51427";

export default meta;
type Story = StoryObj<typeof LatestEventsUI>;

export const Loading: Story = {
  args: {
    allEvents: [],
    autoUpdate: true,
    eventsHref: "/ethereum/0x123456789/events",
  },
};

export const NoEvents: Story = {
  args: {
    allEvents: [],
    autoUpdate: false,
    eventsHref: "/ethereum/0x123456789/events",
  },
};

export const WithEvents: Story = {
  args: {
    allEvents: [
      {
        transactionHash: txStub,
        events: [eventStub("Transfer"), eventStub("Approval")],
      },
      {
        transactionHash: txStub,
        events: [eventStub("Mint")],
      },
      {
        transactionHash: txStub,
        events: [
          eventStub("Transfer"),
          eventStub("Burn"),
          eventStub("Approval"),
        ],
      },
    ],
    autoUpdate: false,
    eventsHref: "/ethereum/0x123456789/events",
  },
};

export const LiveWithEvents: Story = {
  args: {
    allEvents: [
      {
        transactionHash: txStub,
        events: [eventStub("Transfer"), eventStub("Approval")],
      },
      {
        transactionHash: txStub,
        events: [eventStub("Mint")],
      },
      {
        transactionHash: txStub,
        events: [
          eventStub("Transfer"),
          eventStub("Burn"),
          eventStub("Approval"),
        ],
      },
      {
        transactionHash: txStub,
        events: [eventStub("RoleGranted"), eventStub("OwnershipTransferred")],
      },
    ],
    autoUpdate: true,
    eventsHref: "/ethereum/0x123456789/events",
  },
};
