import type { Meta, StoryObj } from "@storybook/nextjs";
import { useId, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { type CouponData, CouponsUI } from "./CouponsUI";

const meta = {
  component: Story,
  title: "Billing/Coupons",
} satisfies Meta<typeof CouponsUI>;

export default meta;
type Story = StoryObj<typeof CouponsUI>;

const couponStubs: CouponData[] = [
  // Forever
  {
    coupon: {
      duration: "forever",
      duration_in_months: null,
      id: "forever_active",
      name: "Example 1",
    },
    end: null,
    id: "di_1QAE7jCQUO4TBFqFQgnS4Qj4",
    start: 1729011691,
  },

  // Once
  {
    coupon: {
      duration: "once",
      duration_in_months: null,
      id: "once_active",
      name: "Example 2",
    },
    end: null,
    id: "once",
    start: 1733391052,
  },

  // Repeating - 3 months
  {
    coupon: {
      duration: "repeating",
      duration_in_months: 3,
      id: "repeating_active",
      name: "Example 3",
    },
    end: 1743391629,
    id: "repeating-3", // Will end in the future
    start: 1733391629,
  },

  // Repeating - 1 month
  {
    coupon: {
      duration: "repeating",
      duration_in_months: 1,
      id: "repeating_single",
      name: "Example 4",
    },
    end: 1736391713,
    id: "repeating-1",
    start: 1733391713,
  },
];

export const Variants: Story = {
  args: {},
};

function Story() {
  const [status, setStatus] = useState<"pending" | "error" | "success">(
    "success",
  );

  const [activeCouponsType, setActiveCouponsType] = useState<
    "multiple" | "zero" | "one"
  >("multiple");

  const activeCoupons = useMemo(() => {
    if (activeCouponsType === "multiple") {
      return couponStubs;
    }

    if (activeCouponsType === "zero") {
      return [];
    }

    if (activeCouponsType === "one") {
      return couponStubs.slice(0, 1);
    }

    return [];
  }, [activeCouponsType]);

  const [hasAccountCoupon, setHasAccountCoupon] = useState(true);
  const [isPaymentSetup, setIsPaymentSetup] = useState(true);
  const [applyCouponStatus, setApplyCouponStatus] = useState<
    200 | 400 | 401 | 409 | 429 | 500
  >(200);

  const hasAccountCouponId = useId();
  const paymentSetupId = useId();

  return (
    <div className="container max-w-[1100px] py-10">
      <div className="mb-8 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Status</h3>
            <RadioGroup
              className="flex gap-4"
              onValueChange={(value) =>
                setStatus(value as "pending" | "error" | "success")
              }
              value={status}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" />
                <Label htmlFor="status-pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="error" />
                <Label htmlFor="status-error">Error</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="success" />
                <Label htmlFor="status-success">Success</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Active Coupons</h3>
            <RadioGroup
              className="flex gap-4"
              onValueChange={(value) =>
                setActiveCouponsType(value as "multiple" | "zero" | "one")
              }
              value={activeCouponsType}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" />
                <Label htmlFor="coupons-multiple">Multiple</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zero" />
                <Label htmlFor="coupons-zero">Zero</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one" />
                <Label htmlFor="coupons-one">One</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Apply Coupon Status</h3>
            <RadioGroup
              className="flex gap-4"
              onValueChange={(value) =>
                setApplyCouponStatus(
                  Number.parseInt(value) as 200 | 400 | 401 | 409 | 429 | 500,
                )
              }
              value={applyCouponStatus.toString()}
            >
              {[200, 400, 401, 409, 429, 500].map((code) => (
                <div className="flex items-center space-x-2" key={code}>
                  <RadioGroupItem
                    id={`status-${code}`}
                    value={code.toString()}
                  />
                  <Label htmlFor={`status-${code}`}>{code}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Other Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Switch
                checked={hasAccountCoupon}
                id={hasAccountCouponId}
                onCheckedChange={setHasAccountCoupon}
              />
              <Label htmlFor={hasAccountCouponId}>Has Account Coupon</Label>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={isPaymentSetup}
                id={paymentSetupId}
                onCheckedChange={setIsPaymentSetup}
              />
              <Label htmlFor={paymentSetupId}>Payment Setup</Label>
            </div>
          </div>
        </div>
      </div>

      <CouponsUI
        accountCouponId={hasAccountCoupon ? activeCoupons[0]?.id : undefined}
        activeCoupons={activeCoupons}
        applyCoupon={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return {
            data:
              applyCouponStatus === 200
                ? {
                    coupon: {
                      duration: "repeating",
                      duration_in_months: 12,
                      id: "test",
                      name: "TEST COUPON",
                    },
                    end: 1759528716,
                    id: "xyz",
                    start: 1727992716,
                  }
                : null,
            status: applyCouponStatus,
          };
        }}
        deleteCoupon={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        isPaymentSetup={isPaymentSetup}
        status={status}
      />
    </div>
  );
}
