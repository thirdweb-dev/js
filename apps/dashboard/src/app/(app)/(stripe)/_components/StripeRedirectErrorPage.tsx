"use client";

import { AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardRouter } from "@/lib/DashboardRouter";

export function StripeRedirectErrorPage(props: { errorMessage: string }) {
  const router = useDashboardRouter();

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center text-center text-sm">
        <div className="mb-4 rounded-full border p-2">
          <AlertTriangleIcon className="size-5 text-destructive-text" />
        </div>
        <p className="font-medium text-base">{props.errorMessage}</p>

        <Button
          className="mt-4"
          onClick={() => router.back()}
          variant="outline"
        >
          Go back
        </Button>
      </div>
    </div>
  );
}
