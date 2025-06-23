import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  placeholder?: string;
};

const defaultDescription =
  "Please describe the issue you're encountering in detail, including steps that led to the error, any error messages, troubleshooting steps you've already taken, and the product(s), dashboard, or SDKs involved.";

export const DescriptionInput = (props: Props) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label className="relative" htmlFor="markdown">
        Description
        <span className="-top-1.5 -right-2 absolute text-destructive">•</span>
      </Label>

      <Textarea
        autoComplete="off"
        maxLength={10000}
        name="markdown"
        placeholder={props.placeholder ?? defaultDescription}
        required
        rows={7}
      />
    </div>
  );
};
