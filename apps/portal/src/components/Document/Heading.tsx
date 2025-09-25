import { cn } from "@/lib/utils";
import { Anchor } from "../ui/Anchor";

export function Heading(props: {
  children: React.ReactNode;
  anchorId: string;
  level: number;
  className?: string;
  anchorClassName?: string;
  noIndex?: boolean;
}) {
  switch (props.level) {
    case 1: {
      return (
        <h1
          className={cn(
            "mb-5 break-words font-bold text-3xl text-foreground tracking-tight",
            props.className,
          )}
          data-noindex={props.noIndex}
        >
          {props.children}
        </h1>
      );
    }

    case 2: {
      return (
        <Anchor
          className={cn("mt-10 mb-3", props.anchorClassName)}
          data-noindex={props.noIndex}
          id={props.anchorId}
        >
          <h2
            className={cn(
              "break-words font-semibold text-2xl text-foreground tracking-tight",
              props.className,
            )}
          >
            {props.children}
          </h2>
        </Anchor>
      );
    }

    case 3: {
      return (
        <Anchor
          className={cn("mt-10 mb-2", props.anchorClassName)}
          data-noindex={props.noIndex}
          id={props.anchorId}
        >
          <h3
            className={cn(
              "break-words font-semibold text-foreground text-xl",
              props.className,
            )}
          >
            {props.children}
          </h3>
        </Anchor>
      );
    }

    case 4: {
      return (
        <Anchor
          className={cn("mt-8 mb-3", props.anchorClassName)}
          data-noindex={props.noIndex}
          id={props.anchorId}
        >
          <h4
            className={cn(
              "break-words font-semibold text-foreground text-lg",
              props.className,
            )}
          >
            {props.children}
          </h4>
        </Anchor>
      );
    }

    case 5: {
      return (
        <Anchor
          className={cn("mt-8 mb-3", props.anchorClassName)}
          data-noindex={props.noIndex}
          id={props.anchorId}
        >
          <h5
            className={cn(
              "break-words font-medium text-foreground text-lg",
              props.className,
            )}
          >
            {props.children}
          </h5>
        </Anchor>
      );
    }

    default: {
      return (
        <Anchor
          className={cn("mt-8 mb-3", props.anchorClassName)}
          data-noindex={props.noIndex}
          id={props.anchorId}
        >
          <h6
            className={cn(
              "break-words font-medium text-foreground text-lg",
              props.className,
            )}
          >
            {props.children}
          </h6>
        </Anchor>
      );
    }
  }
}
