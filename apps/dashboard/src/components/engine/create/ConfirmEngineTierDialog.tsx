import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RocketIcon } from "lucide-react";
import { MONTHLY_PRICE_USD } from "./tier-card";

export const ConfirmEngineTierDialog = (props: {
  tier: "STARTER" | "PREMIUM";
  onConfirm: () => void;
  onOpenChange: (v: boolean) => void;
  open: boolean;
}) => {
  const { tier, onConfirm, open, onOpenChange } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="md:max-w-[400px] z-[10001]"
        dialogOverlayClassName="z-[10000]"
      >
        <DialogHeader>
          <DialogTitle className="leading-snug pr-4">
            Are you sure you want to deploy a{" "}
            {tier === "STARTER" ? "Standard" : "Premium"} Engine?
          </DialogTitle>

          <DialogDescription>
            You will be charged ${MONTHLY_PRICE_USD[tier]} per month for the
            subscription
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="primary" className="gap-2">
            <RocketIcon className="size-3" />
            Deploy now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
