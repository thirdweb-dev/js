import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const defaultDescription =
  "Please describe the issue you're encountering in detail, including steps that led to the error, any error messages, troubleshooting steps you've already taken, and the product(s), dashboard, or SDKs involved.";

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function DescriptionInput(props: Props) {
  return (
    <div className={cn("flex flex-col gap-2", props.className)}>
      <Label className="font-medium text-foreground" htmlFor="markdown">
        Description
        <span className="text-red-500 ml-1 align-middle">*</span>
      </Label>

      <Textarea
        autoComplete="off"
        maxLength={10000}
        name="markdown"
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
        placeholder={props.placeholder ?? defaultDescription}
        required
        rows={5}
      />
    </div>
  );
}
