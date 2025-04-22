"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { format, fromUnixTime } from "date-fns";
import {
  CalendarIcon,
  CalendarX2Icon,
  ClockIcon,
  InfinityIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

type Coupon = {
  id: string;
  name: string;
  duration: "forever" | "once" | "repeating";
  duration_in_months: number | null;
};

export type CouponData = {
  id: string;
  start: number;
  end: number | null;
  coupon: Coupon;
};

type ApplyCouponFn = (promoCode: string) => Promise<{
  status: number;
  data: null | CouponData;
}>;

export type CouponsUIProps = {
  activeCoupons: CouponData[];
  status: "pending" | "error" | "success";
  accountCouponId: string | undefined;
  isPaymentSetup: boolean;
  applyCoupon: ApplyCouponFn;
  deleteCoupon: () => Promise<void>;
};

export function CouponsUI(props: CouponsUIProps) {
  const formatUnixTime = (timestamp: number) => {
    const date = fromUnixTime(timestamp);
    return format(date, "MMM d, yyyy");
  };

  const renderDuration = (coupon: Coupon) => {
    if (coupon.duration === "forever") {
      return (
        <div className="flex items-center gap-2">
          <InfinityIcon className="size-4 text-muted-foreground" />
          <span>Forever</span>
        </div>
      );
    } else if (coupon.duration === "once") {
      return (
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-muted-foreground" />
          <span>One-time discount</span>
        </div>
      );
    } else if (coupon.duration === "repeating") {
      return (
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-muted-foreground" />
          <span>
            Repeats every {coupon.duration_in_months} month
            {coupon.duration_in_months !== 1 ? "s" : ""}
          </span>
        </div>
      );
    } else {
      return null;
    }
  };

  const accountCoupon = props.activeCoupons.find(
    (coupon) => coupon.id === props.accountCouponId,
  );

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b bg-card px-6 py-4">
        <h3 className="font-semibold text-xl tracking-tight">Coupons</h3>

        {/* <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <PlusIcon className="size-4" />
                Apply Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="overflow-hidden p-0">
              <ApplyCouponModalContent
                isPaymentSetup={props.isPaymentSetup}
                applyCoupon={props.applyCoupon}
                accountCoupon={accountCoupon}
              />
            </DialogContent>
          </Dialog> */}
      </div>

      {props.status === "success" && props.activeCoupons.length > 0 ? (
        <TableContainer className="rounded-t-none border-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Starts On</TableHead>
                <TableHead>Ends On</TableHead>
                <TableHead>Duration </TableHead>
                {accountCoupon && (
                  <TableHead className="w-24">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.activeCoupons.map((item) => (
                <TableRow key={item.id}>
                  {/* Name */}
                  <TableCell className="font-medium">
                    {item.coupon.name}
                  </TableCell>

                  {/* Start Date */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="size-4 text-muted-foreground" />
                      {formatUnixTime(item.start)}
                    </div>
                  </TableCell>

                  {/* End Date */}
                  <TableCell>
                    {item.end !== null ? (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="size-4 text-muted-foreground" />
                        {formatUnixTime(item.end)}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CalendarX2Icon className="size-4 text-muted-foreground" />
                        <span className="text-foreground">Never </span>
                      </div>
                    )}
                  </TableCell>

                  {/* Duration */}
                  <TableCell>{renderDuration(item.coupon)}</TableCell>

                  {accountCoupon && (
                    <TableCell>
                      <ToolTipLabel
                        label={
                          item.id === props.accountCouponId
                            ? "Remove coupon"
                            : "This coupon cannot be removed"
                        }
                      >
                        <DeleteCouponButton
                          deleteCoupon={props.deleteCoupon}
                          disabled={item.id !== props.accountCouponId}
                        />
                      </ToolTipLabel>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="px-6 py-4">
          <p className="flex min-h-[150px] items-center justify-center text-muted-foreground">
            {props.status === "pending" ? (
              <Spinner className="size-8" />
            ) : props.status === "error" ? (
              <span className="text-destructive-text">
                Failed to load coupons
              </span>
            ) : (
              <span>No coupons</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

function DeleteCouponButton(props: {
  deleteCoupon: () => Promise<void>;
  disabled: boolean;
}) {
  const deleteCoupon = useMutation({
    mutationFn: props.deleteCoupon,
  });

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={props.disabled}
      onClick={() => {
        const promise = deleteCoupon.mutateAsync();
        toast.promise(promise, {
          success: "Coupon removed successfully",
          error: "Failed to remove coupon",
        });
      }}
      aria-label="Remove coupon"
    >
      {deleteCoupon.isPending ? (
        <Spinner className="size-4" />
      ) : (
        <Trash2Icon className="size-4" />
      )}
    </Button>
  );
}

// UI to add coupon is disable for now
// this will be enabled later in future with some changes

// const applyCouponFormSchema = z.object({
//   promoCode: z.string().min(1, "Coupon code is required"),
// });

// function ApplyCouponModalContent(props: {
//   isPaymentSetup: boolean;
//   applyCoupon: ApplyCouponFn;
//   accountCoupon: CouponData | undefined;
// }) {
//   const applyCoupon = useMutation({
//     mutationFn: props.applyCoupon,
//   });

//   const form = useForm<z.infer<typeof applyCouponFormSchema>>({
//     resolver: zodResolver(applyCouponFormSchema),
//     defaultValues: {
//       promoCode: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof applyCouponFormSchema>) {
//     try {
//       const res = await applyCoupon.mutateAsync(values.promoCode);
//       switch (res.status) {
//         case 200: {
//           toast.success("Coupon applied successfully");

//           break;
//         }
//         case 400: {
//           toast.error("Coupon code is invalid");
//           break;
//         }
//         case 401: {
//           toast.error("You are not authorized to apply coupons", {
//             description: "Login to dashboard and try again",
//           });
//           break;
//         }
//         case 409: {
//           toast.error("Coupon already applied");
//           break;
//         }
//         case 429: {
//           toast.error("Too many coupons applied in a short period", {
//             description: "Please try again after some time",
//           });
//           break;
//         }
//         default: {
//           toast.error("Failed to apply coupon");
//         }
//       }
//     } catch {
//       toast.error("Failed to apply coupon");
//     }
//   }

//   const couponEnabled = props.isPaymentSetup && !props.accountCoupon;

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)}>
//         <div className="p-6">
//           <DialogHeader>
//             <DialogTitle>Apply Coupon</DialogTitle>
//             {couponEnabled && (
//               <DialogDescription>
//                 Enter coupon code to apply discounts or free trials
//               </DialogDescription>
//             )}
//           </DialogHeader>

//           <div className="h-4" />

//           {couponEnabled && (
//             <FormField
//               control={form.control}
//               name="promoCode"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Coupon Code</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       className=""
//                       disabled={!props.isPaymentSetup}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//           )}

//           {!props.isPaymentSetup && (
//             <Alert variant="destructive">
//               <AlertCircleIcon className="size-5" />
//               <AlertTitle>Payment method required</AlertTitle>
//               <AlertDescription>
//                 A valid payment method must be added to apply a coupon.
//               </AlertDescription>
//             </Alert>
//           )}

//           {props.isPaymentSetup && props.accountCoupon && (
//             <Alert variant="destructive">
//               <AlertCircleIcon className="size-5" />
//               <AlertTitle>Coupon already applied</AlertTitle>
//               <AlertDescription>
//                 Remove coupon {`"${props.accountCoupon.coupon.name}"`} to apply
//                 a new coupon
//               </AlertDescription>
//             </Alert>
//           )}
//         </div>

//         <div className="mt-4 flex items-center justify-end border-t bg-card p-6">
//           <Button
//             type="submit"
//             disabled={applyCoupon.isPending || !couponEnabled}
//             className="gap-2"
//           >
//             {applyCoupon.isPending ? (
//               <Spinner className="size-4" />
//             ) : (
//               <TicketCheckIcon className="size-4" />
//             )}
//             Redeem
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
