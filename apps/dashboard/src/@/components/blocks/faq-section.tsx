"use client";
import { ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { cn } from "@/lib/utils";

export function FaqAccordion(props: {
  faqs: Array<{ title: string; description: string }>;
}) {
  return (
    <div className="flex flex-col">
      {props.faqs.map((faq, faqIndex) => (
        <FaqItem
          key={faq.title}
          title={faq.title}
          description={faq.description}
          className={cn(faqIndex === props.faqs.length - 1 && "border-b-0")}
        />
      ))}
    </div>
  );
}

function FaqItem(props: {
  title: string;
  description: string;
  className?: string;
}) {
  const [isOpen, setIsOpenn] = useState(false);
  const contentId = useId();
  return (
    <DynamicHeight>
      <div className={cn("border-b border-dashed", props.className)}>
        <h3>
          <Button
            variant="ghost"
            onClick={() => setIsOpenn(!isOpen)}
            aria-controls={contentId}
            aria-expanded={isOpen}
            className={cn(
              "w-full justify-between h-auto py-5 text-base text-muted-foreground hover:bg-transparent pl-0 text-wrap text-left gap-6",
              isOpen && "text-foreground",
            )}
          >
            {props.title}
            <ChevronDownIcon
              className={cn(
                "size-4 shrink-0 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </Button>
        </h3>

        <p
          className={cn(
            "text-muted-foreground text-base leading-7 pb-6 max-w-4xl",
            !isOpen && "hidden",
          )}
          id={contentId}
        >
          {props.description}
        </p>
      </div>
    </DynamicHeight>
  );
}
