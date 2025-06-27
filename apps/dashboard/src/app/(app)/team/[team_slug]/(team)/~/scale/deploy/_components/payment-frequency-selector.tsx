import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItemButton } from "@/components/ui/radio-group";

export type PaymentFrequency = "monthly" | "annual";

export function PaymentFrequencySelector(props: {
  annualDiscountPercent: number;
  paymentFrequency: PaymentFrequency;
  setPaymentFrequency: (paymentFrequency: PaymentFrequency) => void;
}) {
  return (
    <RadioGroup
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onValueChange={(value: PaymentFrequency) =>
        props.setPaymentFrequency(value)
      }
      value={props.paymentFrequency}
    >
      <RadioGroupItemButton
        className="data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
        value="monthly"
      >
        <div className="flex flex-col items-start gap-1">
          <div className="font-medium">Monthly Billing</div>
          <div className="text-sm text-muted-foreground">
            Pay monthly, cancel anytime
          </div>
        </div>
      </RadioGroupItemButton>

      <RadioGroupItemButton
        className="data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
        value="annual"
      >
        <div className="flex flex-col items-start gap-1">
          <div className="font-medium flex items-center space-x-2">
            <span>Annual Billing</span>
            <Badge variant="default">Save {props.annualDiscountPercent}%</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Pay annually, save on costs
          </div>
        </div>
      </RadioGroupItemButton>
    </RadioGroup>
  );
}
