import { Badge } from "@/components/ui/badge";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

function StoryBadge(props: {
  label: string;
}) {
  return (
    <Badge
      className="mb-3 self-start border-none bg-muted px-3 py-1 font-normal text-muted-foreground text-xs"
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
    <div className="w-full">
      <StoryBadge label={props.label} />
      <div className="bg-background">{props.children}</div>
    </div>
  );
}

export function mobileViewport(
  key: "iphone14" | "iphone14promax" | "ipad11p" | "ipad12p",
) {
  return {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: key,
  };
}

export function storybookLog(...mesages: unknown[]) {
  console.debug(
    "%cStorybook",
    "color: white; background-color: black; padding: 2px 4px; border-radius: 4px;",
    ...mesages,
  );
}

export const storybookThirdwebClient = getClientThirdwebClient({
  jwt: null,
  teamId: undefined,
});
