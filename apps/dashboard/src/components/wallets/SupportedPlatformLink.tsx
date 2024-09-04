import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { cn } from "@/lib/utils";
import { SiReact } from "@react-icons/all-files/si/SiReact";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { SiUnity } from "@react-icons/all-files/si/SiUnity";
import type { IconType } from "react-icons/lib";

export function SupportedPlatformLink(props: {
  platform: "React" | "React Native" | "Unity" | "TypeScript";
  href: string;
  trackingCategory: string;
  className?: string;
}) {
  let icon: IconType = SiReact;
  if (props.platform === "Unity") {
    icon = SiUnity;
  } else if (props.platform === "TypeScript") {
    icon = SiTypescript;
  }

  return (
    <TrackedLinkTW
      category={props.trackingCategory}
      label={`platform-${props.platform.replace(" ", "-").toLowerCase()}`}
      href={props.href}
      target="_blank"
      className={cn(
        "flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm",
        props.className,
      )}
    >
      {icon({ className: "size-4" })}
      {props.platform}
    </TrackedLinkTW>
  );
}
