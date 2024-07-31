import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  placeholder?: string;
};

const defaultDescription =
  "Please describe the issue you're encountering in detail, including steps that led to the error, any error messages, troubleshooting steps you've already taken, and the product(s), dashboard, or SDKs involved.";

export const DescriptionInput = (props: Props) => {
  return (
    <div className="flex flex-col gap-2 items-start">
      <Label htmlFor="markdown" className="relative">
        Description
        <span className="absolute -top-1.5 -right-2 text-destructive">•</span>
      </Label>

      <Textarea
        name="markdown"
        placeholder={props.placeholder ?? defaultDescription}
        autoComplete="off"
        rows={7}
        required
        maxLength={10000}
      />
    </div>
  );
};
