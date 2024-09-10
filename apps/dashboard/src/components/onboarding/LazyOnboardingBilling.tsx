import { Spinner } from "@/components/ui/Spinner/Spinner";
import dynamic from "next/dynamic";

export const LazyOnboardingBilling = dynamic(() => import("./Billing"), {
  loading: () => (
    <div className="h-[300px] flex items-center justify-center">
      <Spinner className="size-5" />
    </div>
  ),
});
