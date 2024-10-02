"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function CouponCard(props: {
  teamId: string | undefined;
}) {
  return (
    <CouponCardUI
      submit={async (promoCode: string) => {
        const res = await fetch("/api/server-proxy/api/v1/coupons/redeem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            promoCode,
            teamId: props.teamId,
          }),
        });

        return res.status;
      }}
    />
  );
}

const couponFormSchema = z.object({
  promoCode: z.string().min(1, "Coupon code is required"),
});

export function CouponCardUI(props: {
  submit: (promoCode: string) => Promise<number>;
}) {
  const form = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      promoCode: "",
    },
  });

  const applyCoupon = useMutation({
    mutationFn: (promoCode: string) => props.submit(promoCode),
  });

  async function onSubmit(values: z.infer<typeof couponFormSchema>) {
    try {
      const status = await applyCoupon.mutateAsync(values.promoCode);
      switch (status) {
        case 200: {
          toast.success("Coupon applied successfully");
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

    form.reset();
  }

  return (
    <section className="relative rounded-lg border border-border bg-muted/50">
      {/* header */}
      <div className="px-4 pt-6 lg:px-6">
        <h3 className="mb-1 font-semibold text-xl tracking-tight">
          Apply Coupon
        </h3>
        <p className="text-muted-foreground text-sm">
          Enter your coupon code to apply discounts or free trials on thirdweb
          products
        </p>
      </div>

      <div className="h-5" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Body */}
          <div className="px-4 lg:px-6">
            <FormField
              control={form.control}
              name="promoCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input {...field} className="lg:max-w-[450px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="h-7" />

          {/* Footer */}
          <div className="flex justify-end border-border border-t px-4 py-4 lg:px-6">
            <Button type="submit" className="gap-2">
              {applyCoupon.isPending && <Spinner className="size-4" />}
              Apply Coupon
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
