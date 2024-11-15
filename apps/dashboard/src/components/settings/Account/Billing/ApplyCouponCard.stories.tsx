import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import { type ActiveCouponResponse, ApplyCouponCardUI } from "./CouponCard";

const meta = {
  title: "Billing/Coupons/ApplyCoupon",
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
    const data: ActiveCouponResponse | null =
      status === 200
        ? {
            id: "xyz",
            start: 1727992716,
            end: 1759528716,
            coupon: {
              id: "XYZTEST",
              name: "TEST COUPON",
              duration: "repeating",
              duration_in_months: 12,
            },
          }
        : null;
    return {
      status,
      data,
    };
  };
}

function Story() {
  return (
    <div className="container flex max-w-[1100px] flex-col gap-10 py-10">
      <BadgeContainer label="Prefill code - XYZ, Success - 200">
        <ApplyCouponCardUI
          submit={statusStub(200)}
          onCouponApplied={undefined}
          prefillPromoCode="XYZ"
          isPaymentSetup={true}
        />
      </BadgeContainer>

      <BadgeContainer label="No Valid Payment setup">
        <ApplyCouponCardUI
          submit={statusStub(200)}
          onCouponApplied={undefined}
          isPaymentSetup={false}
        />
      </BadgeContainer>

      <BadgeContainer label="Success - 200">
        <ApplyCouponCardUI
          submit={statusStub(200)}
          onCouponApplied={undefined}
          isPaymentSetup={true}
        />
      </BadgeContainer>

      <BadgeContainer label="Invalid - 400">
        <ApplyCouponCardUI
          submit={statusStub(400)}
          onCouponApplied={undefined}
          isPaymentSetup={true}
        />
      </BadgeContainer>

      <BadgeContainer label="Not Authorized - 401">
        <ApplyCouponCardUI
          submit={statusStub(401)}
          onCouponApplied={undefined}
          isPaymentSetup={true}
        />
      </BadgeContainer>

      <BadgeContainer label="Already applied - 409">
        <ApplyCouponCardUI
          submit={statusStub(409)}
          onCouponApplied={undefined}
          isPaymentSetup={true}
        />
      </BadgeContainer>

      <BadgeContainer label="Rate Limited - 429">
        <ApplyCouponCardUI
          submit={statusStub(429)}
          onCouponApplied={undefined}
          isPaymentSetup={true}
        />
      </BadgeContainer>

      <BadgeContainer label="Other - 500">
        <ApplyCouponCardUI
          submit={statusStub(500)}
          onCouponApplied={undefined}
          isPaymentSetup={true}
        />
      </BadgeContainer>
      <Toaster richColors />
    </div>
  );
}
