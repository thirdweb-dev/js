import { ToolTipLabel } from "@/components/ui/tooltip";
import { CheckIcon, CircleDollarSignIcon } from "lucide-react";

type FeatureItemProps = {
  text: string | string[];
};

export function FeatureItem({ text }: FeatureItemProps) {
  const titleStr = Array.isArray(text) ? text[0] : text;

  return (
    <div className="flex items-center gap-2">
      <CheckIcon className="size-4 shrink-0 text-green-500" />
      {Array.isArray(text) ? (
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">
            {titleStr}{" "}
            <span className="text-muted-foreground md:hidden">{text[1]}</span>
          </p>
          <ToolTipLabel label={text[1]}>
            <CircleDollarSignIcon className="hidden size-4 text-muted-foreground md:block" />
          </ToolTipLabel>
        </div>
      ) : (
        <p className="text-muted-foreground">{titleStr}</p>
      )}
    </div>
  );
}
