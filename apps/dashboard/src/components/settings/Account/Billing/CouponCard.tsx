"use client";

import { apiServerProxy } from "@/actions/proxies";
import { DangerSettingCard } from "@/components/blocks/DangerSettingCard";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, fromUnixTime } from "date-fns";
import { TagIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";
import { z } from "zod";

const LazyShareFreeWalletsModal = dynamic(
  () =>
    import("./share-free-wallets-modal.client").then((mod) => ({
      default: mod.ShareFreeWalletsModal,
    })),
  {
    ssr: false,
    loading: () => null,
  },
);

export type ActiveCouponResponse = {
  id: string;
  start: number;
  end: number | null;
  coupon: {
    id: string;
    name: string | null;
    duration: "forever" | "once" | "repeating";
    duration_in_months: number | null;
  };
};

function ApplyCouponCard(props: {
  teamId: string | undefined;
  onCouponApplied: (
    data: ActiveCouponResponse,
    isFreeWalletsCoupon: boolean,
  ) => void;
  isPaymentSetup: boolean;
}) {
  const searchParams = useSearchParams();
  const couponCode = searchParams?.get("coupon");
  return (
    <ApplyCouponCardUI
      onCouponApplied={props.onCouponApplied}
      prefillPromoCode={couponCode || undefined}
      scrollIntoView={!!couponCode}
      isPaymentSetup={props.isPaymentSetup}
      submit={async (promoCode: string) => {
        const res = await apiServerProxy<{ data: ActiveCouponResponse }>({
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

        if (res.ok) {
          const json = res.data;
          return {
            status: 200,
            data: json.data,
          };
        }

        return {
          status: res.status,
          data: null,
        };
      }}
    />
  );
}

const couponFormSchema = z.object({
  promoCode: z.string().min(1, "Coupon code is required"),
});

export function ApplyCouponCardUI(props: {
  submit: (promoCode: string) => Promise<{
    status: number;
    data: null | ActiveCouponResponse;
  }>;
  onCouponApplied:
    | ((data: ActiveCouponResponse, isFreeWalletsCoupon: boolean) => void)
    | undefined;
  prefillPromoCode?: string;
  scrollIntoView?: boolean;
  isPaymentSetup: boolean;
}) {
  const containerRef = useRef<HTMLFormElement | null>(null);
  const form = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      promoCode: props.prefillPromoCode || "",
    },
  });

  const scrolled = useRef(false);
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (props.scrollIntoView && !scrolled.current) {
      const el = containerRef.current;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.querySelector("input")?.focus();
        scrolled.current = true;
      }
    }
  }, [props.scrollIntoView]);

  const applyCoupon = useMutation({
    mutationFn: (promoCode: string) => props.submit(promoCode),
  });

  async function onSubmit(values: z.infer<typeof couponFormSchema>) {
    if (!props.isPaymentSetup) {
      return;
    }

    try {
      const res = await applyCoupon.mutateAsync(values.promoCode);
      switch (res.status) {
        case 200: {
          toast.success("Coupon applied successfully");
          if (res.data) {
            props.onCouponApplied?.(
              res.data,
              // prod & dev
              values.promoCode === "FREEWALLETS" ||
                // new prod code
                values.promoCode === "FREEWALLETS24" ||
                values.promoCode === "TESTFREEWALLETS",
            );
          }
          break;
        }
        case 400: {
          toast.error("Coupon code is invalid");
          break;
        }
        case 401: {
          toast.error("You are not authorized to apply coupons", {
            description: "Login to dashboard and try again",
          });
          break;
        }
        case 409: {
          toast.error("Coupon already applied");
          break;
        }
        case 429: {
          toast.error("Too many coupons applied in a short period", {
            description: "Please try again after some time",
          });
          break;
        }
        default: {
          toast.error("Failed to apply coupon");
        }
      }
    } catch {
      toast.error("Failed to apply coupon");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} ref={containerRef}>
        <SettingsCard
          header={{
            title: "Apply Coupon",
            description:
              "Enter your coupon code to apply discounts or free trials on thirdweb products",
          }}
          bottomText={
            props.isPaymentSetup
              ? ""
              : "A valid payment method must be added to apply a coupon."
          }
          saveButton={{
            variant: "outline",
            disabled: !props.isPaymentSetup,
            isPending: applyCoupon.isPending,
            label: "Apply Coupon",
            type: "submit",
          }}
          noPermissionText={undefined}
          errorText={
            form.getFieldState("promoCode", form.formState).error?.message
          }
        >
          <FormField
            control={form.control}
            name="promoCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="lg:max-w-[450px]"
                    disabled={!props.isPaymentSetup}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </SettingsCard>
      </form>
    </Form>
  );
}

export function CouponDetailsCardUI(props: {
  activeCoupon: ActiveCouponResponse;
  deleteCoupon: {
    mutateAsync: () => Promise<void>;
    isPending: boolean;
  };
}) {
  const { activeCoupon, deleteCoupon } = props;
  return (
    <DangerSettingCard
      className="border-border"
      footerClassName="!bg-transparent !border-border"
      title="Coupon Applied"
      description="To apply another coupon, you must remove this coupon"
      buttonLabel="Remove Coupon"
      buttonOnClick={() => {
        const promise = deleteCoupon.mutateAsync();
        toast.promise(promise, {
          success: "Coupon Removed Successfully",
          error: "Failed To Remove Coupon",
        });
      }}
      confirmationDialog={{
        title: `Delete Coupon "${activeCoupon.coupon.name}" ?`,
        description: "Offers added by this coupon will no longer be available.",
      }}
      isPending={deleteCoupon.isPending}
    >
      <div className="mt-3 flex max-w-[600px] items-center gap-3 rounded-lg border border-border bg-background p-4">
        <TagIcon className="hidden size-6 text-muted-foreground lg:block" />
        <div>
          <h4 className="font-medium text-foreground">
            {activeCoupon.coupon.name || `Coupon #${activeCoupon.coupon.id}`}
          </h4>
          <p className="text-muted-foreground text-sm">
            Valid from {format(fromUnixTime(activeCoupon.start), "MMM d, yyyy")}{" "}
            {activeCoupon.end && (
              <>to {format(fromUnixTime(activeCoupon.end), "MMMM d, yyyy")}</>
            )}
          </p>
        </div>
      </div>
    </DangerSettingCard>
  );
}

export function CouponSection(props: {
  teamId: string | undefined;
  isPaymentSetup: boolean;
}) {
  const address = useActiveAccount()?.address;
  const [showShareModal, setShowShareModal] = useState(false);
  const [optimisticCouponData, setOptimisticCouponData] = useState<
    | {
        type: "added";
        data: ActiveCouponResponse;
      }
    | {
        type: "deleted";
        data: null;
      }
  >();

  const activeCoupon = useQuery({
    queryKey: ["active-coupon", address, props.teamId],
    queryFn: async () => {
      const res = await apiServerProxy<{ data: ActiveCouponResponse }>({
        method: "GET",
        pathname: "/v1/active-coupon",
        searchParams: props.teamId ? { teamId: props.teamId } : undefined,
      });

      if (!res.ok) {
        return null;
      }
      const json = res.data;
      return json.data;
    },
  });

  const deleteActiveCoupon = useMutation({
    mutationFn: async () => {
      const res = await apiServerProxy({
        method: "DELETE",
        pathname: "/v1/active-coupon",
        searchParams: props.teamId ? { teamId: props.teamId } : undefined,
      });

      if (!res.ok) {
        throw new Error("Failed to delete coupon");
      }
    },
    onSuccess: () => {
      setOptimisticCouponData({
        type: "deleted",
        data: null,
      });
      activeCoupon.refetch().then(() => {
        setOptimisticCouponData(undefined);
      });
    },
  });

  if (activeCoupon.isPending) {
    return <LoadingCouponSection />;
  }

  const couponData = optimisticCouponData
    ? optimisticCouponData.data
    : activeCoupon.data;

  return (
    <>
      {couponData ? (
        <CouponDetailsCardUI
          activeCoupon={couponData}
          deleteCoupon={{
            mutateAsync: deleteActiveCoupon.mutateAsync,
            isPending: deleteActiveCoupon.isPending,
          }}
        />
      ) : (
        <Suspense fallback={<LoadingCouponSection />}>
          <ApplyCouponCard
            teamId={props.teamId}
            onCouponApplied={(coupon, isFreeWalletsCoupon) => {
              setOptimisticCouponData({
                type: "added",
                data: coupon,
              });

              if (isFreeWalletsCoupon) {
                setShowShareModal(true);
              }
              activeCoupon.refetch().then(() => {
                setOptimisticCouponData(undefined);
              });
            }}
            isPaymentSetup={props.isPaymentSetup}
          />
        </Suspense>
      )}

      {showShareModal && (
        <LazyShareFreeWalletsModal
          isOpen={showShareModal}
          onOpenChange={setShowShareModal}
        />
      )}
    </>
  );
}

function LoadingCouponSection() {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-lg border border-border bg-card">
      <Spinner className="size-6" />
    </div>
  );
}
