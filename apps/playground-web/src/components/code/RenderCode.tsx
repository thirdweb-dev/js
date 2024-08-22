import { cn } from "../../lib/utils";
import { CopyButton } from "../ui/CopyButton";
import { ScrollShadow } from "../ui/ScrollShadow/ScrollShadow";

export function RenderCode(props: {
  code: string;
  html: string;
  className?: string;
  scrollableClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative max-w-full border group rounded-xl bg-code",
        props.className,
      )}
    >
      <ScrollShadow
        scrollableClassName={cn("p-4 lg:p-6", props.scrollableClassName)}
        className={"text-xs md:text-sm [&_*]:leading-relaxed"}
        shadowColor="hsl(var(--code))"
      >
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: we know what we're doing here
          dangerouslySetInnerHTML={{ __html: props.html }}
        />
      </ScrollShadow>
      <CopyButton
        text={props.code}
        iconClassName="size-3"
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 z-10 p-2 border transition-opacity duration-300 bg-code"
      />
    </div>
  );
}
