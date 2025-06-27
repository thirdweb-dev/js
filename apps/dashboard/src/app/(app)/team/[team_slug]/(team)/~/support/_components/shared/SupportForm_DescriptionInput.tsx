import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  placeholder?: string;
};

const defaultDescription =
  "Please describe the issue you're encountering in detail, including steps that led to the error, any error messages, troubleshooting steps you've already taken, and the product(s), dashboard, or SDKs involved.";

export const DescriptionInput = (props: Props) => {
  return (
    <div className="flex flex-col items-start gap-3">
      <Label
        className="relative text-base font-medium text-white"
        htmlFor="markdown"
      >
        Description
        <span className="-top-1.5 -right-2 absolute text-red-500">•</span>
      </Label>

      <Textarea
        autoComplete="off"
        className="min-h-[120px] bg-[#0A0A0A] border-[#1F1F1F] text-white placeholder:text-[#737373] hover:border-[#333333] focus:border-[#2663EB] focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
        maxLength={10000}
        name="markdown"
        placeholder={props.placeholder ?? defaultDescription}
        required
        rows={7}
      />
    </div>
  );
};
