import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { StarIcon } from "lucide-react";
import { BadgeContainer } from "../../../stories/utils";

const meta = {
  title: "Shadcn/Buttons",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: {},
};

function Component() {
  return (
    <div className="flex min-h-dvh flex-col gap-6 bg-background p-6 text-foreground">
      <Variants size="default" />
      <Variants size="sm" />
      <Variants size="icon" />
      <Variants size="lg" />
    </div>
  );
}

function Variants(props: {
  size: "default" | "icon" | "sm" | "lg";
}) {
  return (
    <BadgeContainer label={`Size: ${props.size}`}>
      <div className="flex gap-6">
        <Button size={props.size}>
          {props.size === "icon" ? <StarIcon className="size-4" /> : "Default"}
        </Button>
        <Button variant="primary" size={props.size}>
          {props.size === "icon" ? <StarIcon className="size-4" /> : "Primary"}
        </Button>
        <Button variant="secondary" size={props.size}>
          {props.size === "icon" ? (
            <StarIcon className="size-4" />
          ) : (
            "Secondary"
          )}
        </Button>
        <Button variant="ghost" size={props.size}>
          {props.size === "icon" ? <StarIcon className="size-4" /> : "Ghost"}
        </Button>
        <Button variant="outline" size={props.size}>
          {props.size === "icon" ? <StarIcon className="size-4" /> : "Outline"}
        </Button>
        <Button variant="destructive" size={props.size}>
          {props.size === "icon" ? (
            <StarIcon className="size-4" />
          ) : (
            "Destructive"
          )}
        </Button>
      </div>
    </BadgeContainer>
  );
}
