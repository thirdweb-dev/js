import { Img } from "@/components/blocks/Img";
import { BoxIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

export function ProjectAvatar(props: {
  src: string | undefined;
  className: string | undefined;
}) {
  return (
    <Img
      src={props.src}
      className={cn("rounded-lg border border-border", props.className)}
      alt={""}
      fallback={
        <div className="flex items-center justify-center bg-card">
          <BoxIcon className="size-[50%] text-muted-foreground" />
        </div>
      }
    />
  );
}
