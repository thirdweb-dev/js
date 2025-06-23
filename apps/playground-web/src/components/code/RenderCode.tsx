import { cn } from "../../lib/utils";
import { CopyButton } from "../ui/CopyButton";
import { ScrollShadow } from "../ui/ScrollShadow/ScrollShadow";

export function RenderCode(props: {
  code: string;
  html: string;
  className?: string;
  scrollableClassName?: string;
  scrollableContainerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "group relative max-w-full overflow-hidden rounded-xl border bg-card",
        props.className,
      )}
    >
      <ScrollShadow
        className={cn(
          "h-full text-xs md:text-sm [&_*]:leading-relaxed",
          props.scrollableContainerClassName,
        )}
        scrollableClassName={cn("p-4", props.scrollableClassName)}
        shadowColor="hsl(var(--muted))"
      >
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: we know what we're doing here
          dangerouslySetInnerHTML={{ __html: props.html }}
        />
      </ScrollShadow>
      <CopyButton
        className="absolute top-4 right-4 z-10 border bg-background p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        iconClassName="size-3"
        text={props.code}
      />
    </div>
  );
}
