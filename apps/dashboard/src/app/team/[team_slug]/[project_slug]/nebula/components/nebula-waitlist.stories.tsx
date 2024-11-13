import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import { mobileViewport } from "stories/utils";
import { JoinNebulaWaitlistPageUI } from "./nebula-waitlist-page-ui.client";

const meta = {
  title: "nebula/waitlist",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotInWaitingListDesktop: Story = {
  args: {
    inWaitlist: false,
  },
};

export const InWaitingListDesktop: Story = {
  args: {
    inWaitlist: true,
  },
};

export const NotInWaitingListMobile: Story = {
  args: {
    inWaitlist: false,
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

export const InWaitingListMobile: Story = {
  args: {
    inWaitlist: true,
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story(props: {
  inWaitlist: boolean;
}) {
  return (
    <>
      <JoinNebulaWaitlistPageUI
        onWaitlist={props.inWaitlist}
        joinWaitList={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }}
      />
      <Toaster richColors />
    </>
  );
}
