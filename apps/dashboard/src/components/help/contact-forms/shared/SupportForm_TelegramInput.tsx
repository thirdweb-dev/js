import { Label } from "@/components/ui/label";

type Props = {
  placeholder?: string;
};

const defaultDescription = "@YourHandle";

export const SupportForm_TelegramInput = (props: Props) => {
  return (
    <div className="flex flex-col items-start gap-2 bg-[#0a0a0a]">
      <Label className="relative" htmlFor="telegram">
        Telegram
        <span className="-top-1.5 -right-2 absolute text-destructive">•</span>
      </Label>

      <input
        autoComplete="off"
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        maxLength={50}
        name="telegram"
        placeholder={props.placeholder ?? defaultDescription}
        type="text"
      />
    </div>
  );
};
