"use client";

import type { Team } from "@/api/team";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleXIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { pollWithTimeout } from "../../../../../utils/pollWithTimeout";

const cancelPlanFormSchema = z
  .object({
    comment: z.string().optional(),
    feedback: z.enum([
      "customer_service",
      "low_quality",
      "missing_features",
      "other",
      "switched_service",
      "too_complex",
      "too_expensive",
      "unused",
    ]),
  })
  // if feedback is other, comment is required
  .refine(
    (data) =>
      !(
        data.feedback === "other" &&
        (!data.comment || data.comment.trim() === "")
      ),
    {
      message: "Required",
      path: ["comment"],
    },
  );

type CancelPlanParams = z.infer<typeof cancelPlanFormSchema>;
export type CancelPlan = (params: CancelPlanParams) => Promise<void>;

const cancelReasons: Array<{
  value: CancelPlanParams["feedback"];
  label: string;
}> = [
  { value: "too_expensive", label: "Too expensive" },
  { value: "too_complex", label: "Too complex to use" },
  { value: "missing_features", label: "Missing features I need" },
  { value: "low_quality", label: "Quality doesn't meet expectations" },
  { value: "unused", label: "Not using it enough" },
  { value: "switched_service", label: "Switched to another service" },
  { value: "customer_service", label: "Unhappy with customer service" },
  { value: "other", label: "Other reason" },
];

export function CancelPlanButton(props: {
  cancelPlan: CancelPlan;
  currentPlan: Team["billingPlan"];
  getTeam: () => Promise<Team>;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-background">
          <CircleXIcon className="size-4 text-muted-foreground" />
          Cancel Plan
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-lg w-full overflow-auto">
        <SheetHeader className="sr-only">
          <SheetTitle className="text-left text-2xl tracking-tight">
            Cancel Plan
          </SheetTitle>
        </SheetHeader>

        {props.currentPlan === "pro" ? (
          <ProPlanCancelPlanSheetContent />
        ) : (
          <CancelPlanSheetContent
            cancelPlan={props.cancelPlan}
            getTeam={props.getTeam}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

const PRO_CONTACT_US_URL =
  "https://meetings.hubspot.com/sales-thirdweb/thirdweb-pro";

function ProPlanCancelPlanSheetContent() {
  return (
    <div>
      <h2 className="mb-1 font-semibold text-2xl tracking-tight">
        Cancel Plan
      </h2>
      <p className="mb-5 text-muted-foreground text-sm">
        Please contact us to cancel your Pro plan
      </p>

      <Button variant="outline" asChild className="w-full gap-2 bg-card">
        <Link href={PRO_CONTACT_US_URL} target="_blank">
          Contact Us <ExternalLinkIcon className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

function CancelPlanSheetContent(props: {
  cancelPlan: CancelPlan;
  getTeam: () => Promise<Team>;
}) {
  const [_isPending, startTransition] = useTransition();
  const [isPollingTeam, setIsPollingTeam] = useState(false);
  const router = useDashboardRouter();
  const isPending = _isPending || isPollingTeam;

  const form = useForm<z.infer<typeof cancelPlanFormSchema>>({
    resolver: zodResolver(cancelPlanFormSchema),
    defaultValues: {
      comment: "",
      feedback: undefined,
    },
  });

  const cancelPlan = useMutation({
    mutationFn: props.cancelPlan,
  });

  function onSubmit(values: z.infer<typeof cancelPlanFormSchema>) {
    const promise = cancelPlan.mutateAsync(values);
    toast.promise(promise, {
      success: "Plan cancelled successfully",
      error: "Failed to cancel plan",
    });
    promise.then(async () => {
      setIsPollingTeam(true);
      // keep polling until the team plan is free, then refresh the page
      await pollWithTimeout({
        shouldStop: async () => {
          const team = await props.getTeam();
          return team.billingPlan === "free";
        },
        timeoutMs: 7000,
      });

      setIsPollingTeam(false);

      startTransition(() => {
        router.refresh();
      });
    });
  }

  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <h2 className="font-semibold text-2xl tracking-tight">Cancel Plan</h2>
        {isPending && <Spinner className="size-5" />}
      </div>
      <p className="mb-4 text-muted-foreground text-sm">
        Please let us know why you're cancelling your plan. Your feedback helps
        us improve our service.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why are you cancelling?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cancelReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional comments</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more about your experience"
                    className="bg-card"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={cancelPlan.isPending}
          >
            {cancelPlan.isPending ? <Spinner className="mr-2 h-4 w-4" /> : null}
            Cancel plan
          </Button>
        </form>
      </Form>
    </div>
  );
}
