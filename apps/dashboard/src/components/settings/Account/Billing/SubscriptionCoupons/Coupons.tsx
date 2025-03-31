import { API_SERVER_URL } from "@/constants/env";
import { Suspense } from "react";
import { getAuthToken } from "../../../../../app/api/lib/getAuthToken";
import { CouponsClient } from "./CouponsClient";
import type { CouponData } from "./CouponsUI";

async function AsyncCoupons(props: {
  teamId: string;
  isPaymentSetup: boolean;
}) {
  const authToken = await getAuthToken();

  const allCouponsPromise = fetch(
    `${API_SERVER_URL}/v1/active-coupons?teamId=${props.teamId}`,
    {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    },
  );

  const accountCouponPromise = fetch(
    `${API_SERVER_URL}/v1/active-coupon?teamId=${props.teamId}`,
    {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    },
  );

  const [allCouponsRes, accountCouponRes] = await Promise.allSettled([
    allCouponsPromise,
    accountCouponPromise,
  ]);

  if (
    allCouponsRes.status === "rejected" ||
    accountCouponRes.status === "rejected"
  ) {
    return (
      <CouponsClient
        status="error"
        activeCoupons={[]}
        accountCouponId={undefined}
        isPaymentSetup={props.isPaymentSetup}
        teamId={props.teamId}
      />
    );
  }

  const allCouponsData = (await allCouponsRes.value.json()) as {
    data: CouponData[];
  };

  const accountCouponData = (await accountCouponRes.value.json()) as {
    data: CouponData | null;
  };

  return (
    <CouponsClient
      status="success"
      activeCoupons={allCouponsData.data}
      accountCouponId={accountCouponData.data?.id}
      isPaymentSetup={props.isPaymentSetup}
      teamId={props.teamId}
    />
  );
}

export function Coupons(props: {
  teamId: string;
  isPaymentSetup: boolean;
}) {
  return (
    <Suspense
      fallback={
        <CouponsClient
          status="pending"
          activeCoupons={[]}
          accountCouponId={undefined}
          isPaymentSetup={true}
          teamId={props.teamId}
        />
      }
    >
      <AsyncCoupons
        teamId={props.teamId}
        isPaymentSetup={props.isPaymentSetup}
      />
    </Suspense>
  );
}
