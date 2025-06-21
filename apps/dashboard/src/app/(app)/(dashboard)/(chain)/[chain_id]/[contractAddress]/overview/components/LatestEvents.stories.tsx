import type { Meta, StoryObj } from "@storybook/nextjs";
import { LatestEventsUI } from "./LatestEvents";

const meta: Meta<typeof LatestEventsUI> = {
  args: {
    allEvents: [],
    autoUpdate: false,
    eventsHref: "/ethereum/0x123456789/events",
  },
  component: LatestEventsUI,
  decorators: [
    (Story) => (
      <div className="container max-w-4xl py-10">
        <Story />
      </div>
    ),
  ],
  title: "Contracts/Overview/LatestEvents",
};

function eventStub(eventName: string) {
  return {
    address: "0x",
    args: [],
    eventName,
    logIndex: 0,
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
        events: [eventStub("Transfer"), eventStub("Approval")],
        transactionHash: txStub,
      },
      {
        events: [eventStub("Mint")],
        transactionHash: txStub,
      },
      {
        events: [
          eventStub("Transfer"),
          eventStub("Burn"),
          eventStub("Approval"),
        ],
        transactionHash: txStub,
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
        events: [eventStub("Transfer"), eventStub("Approval")],
        transactionHash: txStub,
      },
      {
        events: [eventStub("Mint")],
        transactionHash: txStub,
      },
      {
        events: [
          eventStub("Transfer"),
          eventStub("Burn"),
          eventStub("Approval"),
        ],
        transactionHash: txStub,
      },
      {
        events: [eventStub("RoleGranted"), eventStub("OwnershipTransferred")],
        transactionHash: txStub,
      },
    ],
    autoUpdate: true,
    eventsHref: "/ethereum/0x123456789/events",
  },
};
