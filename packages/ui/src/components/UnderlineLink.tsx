import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

type LinkProps = React.ComponentProps<typeof Link>;

export function UnderlineLink(props: LinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:text-foreground hover:decoration-foreground hover:decoration-solid",
        props.className,
      )}
    />
  );
}
