import { Spinner } from "@/components/ui/Spinner/Spinner";
import dynamic from "next/dynamic";

export const LazyOnboardingBilling = dynamic(() => import("./Billing"), {
  loading: () => (
    <div className="flex h-[300px] items-center justify-center">
      <Spinner className="size-5" />
    </div>
  ),
});
