import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toaster } from "sonner";
import { mobileViewport } from "../../../../stories/utils";
import { CouponDetailsCardUI } from "./CouponCard";

const meta = {
  title: "billing/Coupons/CouponDetails",
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

function Story() {
  const [isPending, setIsPending] = useState(false);
  return (
    <div className="container flex max-w-[1100px] flex-col gap-10 py-10">
      <CouponDetailsCardUI
        activeCoupon={{
          id: "xyz",
          start: 1727992716,
          end: 1759528716,
          coupon: {
            id: "XYZFOOBAR",
            name: "TEST COUPON",
            duration: "repeating",
            duration_in_months: 12,
          },
        }}
        deleteCoupon={{
          mutateAsync: async () => {
            setIsPending(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setIsPending(false);
          },
          isPending: isPending,
        }}
      />

      <Toaster richColors />
    </div>
  );
}
