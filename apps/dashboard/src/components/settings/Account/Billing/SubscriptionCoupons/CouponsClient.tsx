"use client";

import { apiServerProxy } from "@/actions/proxies";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { type CouponData, CouponsUI, type CouponsUIProps } from "./CouponsUI";

export function CouponsClient(
  props: Omit<
    CouponsUIProps,
    "applyCoupon" | "onCouponApplied" | "deleteCoupon"
  > & {
    teamId: string;
  },
) {
  const router = useDashboardRouter();
  return (
    <CouponsUI
      {...props}
      deleteCoupon={async () => {
        const res = await apiServerProxy({
          method: "DELETE",
          pathname: "/v1/active-coupon",
          searchParams: props.teamId ? { teamId: props.teamId } : undefined,
        });

        if (!res.ok) {
          throw new Error("Failed to delete coupon");
        }

        router.refresh();
      }}
      applyCoupon={async (promoCode: string) => {
        const res = await apiServerProxy<{ data: CouponData }>({
          method: "POST",
          pathname: "/v1/coupons/redeem",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            promoCode,
            teamId: props.teamId,
          }),
        });

        if (!res.ok) {
          return {
            status: res.status,
            data: null,
          };
        }

        const json = res.data;

        router.refresh();

        return {
          status: 200,
          data: json.data,
        };
      }}
    />
  );
}
