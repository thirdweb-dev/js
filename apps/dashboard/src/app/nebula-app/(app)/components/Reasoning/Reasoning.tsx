import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export function Reasoning(props: {
  isPending: boolean;
  texts: string[];
}) {
  const [_isOpen, setIsOpen] = useState(false);
  const isOpen = props.isPending ? true : _isOpen;

  return (
    <DynamicHeight>
      <Button
        variant="link"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-auto w-auto items-center gap-1 px-0 py-1 pb-2 font-normal text-base text-muted-foreground hover:text-foreground hover:no-underline"
      >
        {props.isPending ? (
          <TextShimmer text="Reasoning..." />
        ) : (
          <span>Reasoning</span>
        )}

        {!props.isPending && (
          <ChevronDownIcon
            className={cn(
              "size-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        )}
      </Button>

      {isOpen && props.texts.length > 0 && (
        <ul className="list-none space-y-1.5">
          {props.texts.map((text) => (
            <li
              key={text}
              className="fade-in-0 animate-in text-muted-foreground text-sm leading-relaxed duration-300"
            >
              {text.trim()}
            </li>
          ))}
        </ul>
      )}
    </DynamicHeight>
  );
}
