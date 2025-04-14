import { CustomAccordion } from "@/components/ui/CustomAccordion";
import { cn } from "../../../../lib/utils";

export function CollapsibleSection(props: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  title: string;
  icon: React.FC<{ className?: string }>;
  triggerContainerClassName?: string;
}) {
  return (
    <CustomAccordion
      chevronPosition="right"
      chevronClassName="size-5"
      trigger={
        <span className="flex items-center gap-3 font-semibold text-lg tracking-tight">
          <props.icon className="size-5" />
          {props.title}
        </span>
      }
      triggerContainerClassName={cn(
        "rounded-2xl !px-5 !py-3 text-muted-foreground hover:text-foreground bg-card  border hover:bg-accent transition-colors",
        props.triggerContainerClassName,
      )}
      activeTriggerClassName="bg-card text-foreground "
      defaultOpen={props.defaultOpen}
      containerClassName="border-none"
    >
      {/* 4px to prevent cutting off focus rings  */}
      <div className="px-[4px]">{props.children}</div>
    </CustomAccordion>
  );
}
