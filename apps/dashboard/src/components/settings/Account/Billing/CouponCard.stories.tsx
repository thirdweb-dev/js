import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import { CouponCardUI } from "./CouponCard";

const meta = {
  title: "billing/CouponCard",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

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

function statusStub(status: number) {
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return status;
  };
}

function Story() {
  return (
    <div className="container flex max-w-[1100px] flex-col gap-10 py-10">
      <BadgeContainer label="Success - 200">
        <CouponCardUI submit={statusStub(200)} />
      </BadgeContainer>

      <BadgeContainer label="Invalid - 400">
        <CouponCardUI submit={statusStub(400)} />
      </BadgeContainer>

      <BadgeContainer label="Not Authorized - 401">
        <CouponCardUI submit={statusStub(401)} />
      </BadgeContainer>

      <BadgeContainer label="Already applied - 409">
        <CouponCardUI submit={statusStub(409)} />
      </BadgeContainer>

      <BadgeContainer label="Rate Limited - 429">
        <CouponCardUI submit={statusStub(429)} />
      </BadgeContainer>

      <BadgeContainer label="Other - 500">
        <CouponCardUI submit={statusStub(500)} />
      </BadgeContainer>
      <Toaster richColors />
    </div>
  );
}
