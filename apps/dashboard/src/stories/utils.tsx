import { useLayoutEffect } from "react";
import { Badge } from "../@/components/ui/badge";

export function useSetStoryTheme(theme: "light" | "dark") {
  useLayoutEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);
}

export function StoryBadge(props: {
  label: string;
}) {
  return (
    <Badge
      className="self-start mb-3 text-xs px-3 py-1 font-normal bg-background font-mono text-muted-foreground"
      variant="outline"
    >
      {props.label}
    </Badge>
  );
}

export function BadgeContainer(props: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <StoryBadge label={props.label} />
      <div className="bg-background">{props.children}</div>
    </div>
  );
}
